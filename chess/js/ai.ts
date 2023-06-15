import { Setter } from "solid-js";
import {
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
  Promotion,
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
import { getCastling, getLegalMoves, getPiecesLegalMoves } from "./game/get-moves";
import { generateMovePromotion } from "./game/generate-move";
import { getMark } from "./game/mark";
import { isFinished } from "./game/finish";
import { getNextState } from "./game/get-next";

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

        const moves = [...getLegalMoves(board, enPassant, from)];
        const castlingMoves = from === 4 || from === 60 ? [...getCastling(board, castling, mark)] : [];

        if (moves.length === 0 && castlingMoves.length === 0) {
          continue;
        }

        setMovable([...moves.map((move) => move.to), ...castlingMoves.map((move) => move.rook)]);

        const to = await input();
        setMovable([]);
        if (to === Reset) {
          return { type: Reset };
        }

        const toMove = moves.find((move) => move.to === to);
        if (toMove !== undefined) {
          if (toMove.type === Promotion) {
            openPromotionMark(mark);
            const piece = await promotionInput();
            return generateMovePromotion(from, to, piece);
          }
          return toMove;
        }

        const toCastlingMove = castlingMoves.find((move) => move.rook === to);
        if (toCastlingMove !== undefined) {
          return toCastlingMove;
        }
      }
    },
  };
};

export const aiPlayer: Player = {
  async getMove(state: GameState): Promise<MoveTypes> {
    await sleep(0);

    const moves = [
      ...getPiecesLegalMoves(state.board, state.mark, state.enPassant),
      ...getCastling(state.board, state.castling, state.mark),
    ];

    let maxValue = Number.NEGATIVE_INFINITY;
    let maxMove: MoveTypeMove | MoveTypeEnPassant | MoveTypePromotion | MoveTypeCastling | undefined;
    for (const move of moves) {
      const nextState = getNextState(state, move);

      const value = alphaBeta(nextState, 2);

      if (value > maxValue) {
        maxValue = value;
        maxMove = move;
      }
    }

    await sleep(100);

    return maxMove ?? { type: Resign };
  },
};

const sleep = (millisecond: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), millisecond));

const alphaBeta = (
  state: GameState,
  depth: number,
  alpha: number = Number.NEGATIVE_INFINITY,
  beta: number = Number.POSITIVE_INFINITY,
): number => {
  if (depth === 0 || isFinished(state)) {
    const value = evaluateState(state);

    return value;
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
