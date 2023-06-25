import { Setter } from "solid-js";
import {
  Black,
  BlackBishop,
  BlackKing,
  BlackKnight,
  BlackPawn,
  BlackQueen,
  BlackRook,
  Empty,
  GameState,
  Index,
  InputType,
  Mark,
  MoveTypeCastling,
  MoveTypeEnPassant,
  MoveTypeMove,
  MoveTypePromotion,
  MoveTypes,
  Piece,
  Player,
  PromotionPieces,
  Receiver,
  Reset,
  Resign,
  Sender,
  WhiteBishop,
  WhiteKing,
  WhiteKnight,
  WhitePawn,
  WhiteQueen,
  WhiteRook,
} from "./types";
import { getCastling, getPiecesLegalMoves } from "./game/get-moves";
import { generateMovePromotion } from "./game/generate-move";
import { getMark } from "./game/mark";
import { isFinished } from "./game/finish";
import { getNextState } from "./game/get-next";
import { randomSelect } from "@/common/random-select";
import { get_selected_piece_moves } from "@/chess/wasm/pkg/chess_wasm";
import {
  convertMarkToWasmMark,
  convertBoardToWasmBoard,
  convertEnPassantToWasmEnPassant,
  convertCastlingToWasmCastling,
  convertWasmMoveToMove,
  WasmMove,
  convertPositionToIndex,
} from "./wasm-convert";

export const createMessenger = <T>(): [Sender<T>, Receiver<T>] => {
  let resolveFunction = (value: T): void => void value;

  const sender: Sender<T> = (value) => {
    resolveFunction(value);
  };

  const receiver = () => {
    return new Promise<T>((resolve) => (resolveFunction = resolve));
  };

  return [sender, receiver];
};

export const createHumanPlayer = (
  input: Receiver<InputType>,
  setMovable: Setter<Index[]>,
  promotionInput: Receiver<PromotionPieces>,
  openPromotionMark: Setter<Mark>,
): Player => {
  return {
    async getMove({ board, mark, castling, enPassant }: GameState): Promise<MoveTypes> {
      for (;;) {
        const from = await input();
        if (from === Reset) {
          return { type: Reset };
        }

        if (getMark(board[from]) !== mark) {
          continue;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        const w_moves: string = get_selected_piece_moves(
          from,
          convertMarkToWasmMark(mark),
          convertBoardToWasmBoard(board),
          convertEnPassantToWasmEnPassant(enPassant),
          convertCastlingToWasmCastling(castling),
        );

        const movable = w_moves
          .split(":")
          .filter(Boolean)
          .map((m) => m.split(" ") as WasmMove);

        if (movable.length === 0) {
          continue;
        }

        setMovable(movable.map((m) => convertPositionToIndex(m[2])));

        const to = await input();
        setMovable([]);
        if (to === Reset) {
          return { type: Reset };
        }

        const toMove = movable.find((move) => convertPositionToIndex(move[2]) === to);
        if (toMove !== undefined) {
          if (toMove[0] === "p") {
            openPromotionMark(mark);
            const piece = await promotionInput();
            return generateMovePromotion(from, to, piece);
          }
          return convertWasmMoveToMove(toMove);
        }
      }
    },
  };
};

export const aiPlayer: Player = {
  async getMove(state: GameState): Promise<MoveTypes> {
    await sleep(0);

    console.time("get move");

    const moves = [
      ...getPiecesLegalMoves(state.board, state.mark, state.enPassant),
      ...getCastling(state.board, state.castling, state.mark),
    ];

    let maxValue = Number.NEGATIVE_INFINITY;
    const maxMoves: (MoveTypeMove | MoveTypeEnPassant | MoveTypePromotion | MoveTypeCastling)[] = [];
    for (const move of moves) {
      const nextState = getNextState(state, move);

      const timeout = { timeout: false };
      setTimeout(() => (timeout.timeout = true), 400);
      const value = await minimaxBreadthFirst(nextState, 3, timeout);

      if (value > maxValue) {
        maxValue = value;
        maxMoves.length = 0;
        maxMoves.push(move);
      } else if (value === maxValue) {
        maxMoves.push(move);
      }
    }

    console.timeEnd("get move");

    await sleep(100);

    return randomSelect(maxMoves) ?? { type: Resign };
  },
};

const sleep = (millisecond: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), millisecond));

export const alphaBeta = (
  state: GameState,
  depth: number,
  alpha: number = Number.NEGATIVE_INFINITY,
  beta: number = Number.POSITIVE_INFINITY,
): number => {
  if (depth === 0 || isFinished(state)) {
    const value = evaluateState(state);

    // 白の手番＝黒の動きの結果なので色と計算が逆になる
    return value * (state.mark === Black ? 1 : -1);
  }

  for (const move of getPiecesLegalMoves(state.board, state.mark, state.enPassant)) {
    const value = alphaBeta(getNextState(state, move), depth - 1, -beta, -alpha);
    alpha = Math.max(alpha, -value);
    if (alpha >= beta) {
      break;
    }
  }

  return alpha;
};

export const minimaxBreadthFirst = async (
  state: GameState,
  depth: number,
  timeout?: { timeout: boolean },
): Promise<number> => {
  const queue: [state: GameState, depth: number, max: boolean][] = [[state, depth, state.mark === Black]];

  let node;
  let maxValue = Number.NEGATIVE_INFINITY;
  let minValue = Number.POSITIVE_INFINITY;
  while ((node = queue.shift())) {
    await sleep(0);

    const [state, depth, max] = node;

    const value = evaluateState(state);

    if (max) {
      maxValue = Math.max(maxValue, value);
    } else {
      minValue = Math.min(minValue, value);
    }

    if ((depth <= 0 && (timeout?.timeout ?? true)) || isFinished(state)) {
      continue;
    }

    for (const move of getPiecesLegalMoves(state.board, state.mark, state.enPassant)) {
      const nextState = getNextState(state, move);
      queue.push([nextState, depth - 1, false]);
    }

    if (maxValue >= minValue) {
      break;
    }
  }

  return state.mark === Black ? maxValue : -minValue;
};

const pieceCosts: Record<Piece | Empty, number> = {
  [Empty]: 0,
  [WhitePawn]: 1,
  [WhiteKnight]: 3,
  [WhiteBishop]: 3,
  [WhiteRook]: 5,
  [WhiteQueen]: 9,
  [WhiteKing]: 100,
  [BlackPawn]: -1,
  [BlackKnight]: -3,
  [BlackBishop]: -3,
  [BlackRook]: -5,
  [BlackQueen]: -9,
  [BlackKing]: -100,
};

/**
 * 白有利が+
 * 黒有利が-
 * @param state
 * @returns
 */
const evaluateState = (state: GameState): number => {
  let sum = 0;
  for (const square of state.board) {
    sum += pieceCosts[square];
  }

  return sum;
};
