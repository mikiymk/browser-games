import { createResource } from "solid-js";
import type { JSXElement } from "solid-js";
import { ShogiBoard } from "./board";
import { PlayerTypeAi, PlayerTypeHuman, playerType } from "@/scripts/player";
import { gameLoop, getWasm } from "../game-loop";
import { doNothingFunction } from "@/scripts/do-nothing";
import { BLACK, BLACK_BISHOP, BLACK_BISHOP_PROMOTED, BLACK_GOLD, BLACK_KING, BLACK_KNIGHT, BLACK_KNIGHT_PROMOTED, BLACK_LANCE, BLACK_LANCE_PROMOTED, BLACK_PAWN, BLACK_PAWN_PROMOTED, BLACK_ROOK, BLACK_ROOK_PROMOTED, BLACK_SILVER, BLACK_SILVER_PROMOTED, EMPTY, MOVE_TARGET, WHITE, WHITE_BISHOP, WHITE_BISHOP_PROMOTED, WHITE_GOLD, WHITE_KING, WHITE_KNIGHT, WHITE_KNIGHT_PROMOTED, WHITE_LANCE, WHITE_LANCE_PROMOTED, WHITE_PAWN, WHITE_PAWN_PROMOTED, WHITE_ROOK, WHITE_ROOK_PROMOTED, WHITE_SILVER, WHITE_SILVER_PROMOTED } from "../constants";
import { createStore, produce } from "solid-js/store";
import { MultiPromise } from "@/scripts/multi-promise";

export const App = (): JSXElement => {
  const query = new URLSearchParams(location.search);

  const playerBlack = playerType(query.get("first"), PlayerTypeHuman);
  const playerWhite = playerType(query.get("second"), PlayerTypeAi);

  const [board, setFullBoard] = createStore<readonly { piece: number; moveTarget: boolean }[]>(
    Array.from({ length: 81 }, (_, index) => ({
      piece: [
        BLACK_KING,
        BLACK_ROOK,
        BLACK_BISHOP,
        BLACK_GOLD,
        BLACK_SILVER,
        BLACK_KNIGHT,
        BLACK_LANCE,
        BLACK_PAWN,

        BLACK_ROOK_PROMOTED,
        BLACK_BISHOP_PROMOTED,
        BLACK_SILVER_PROMOTED,
        BLACK_KNIGHT_PROMOTED,
        BLACK_LANCE_PROMOTED,
        BLACK_PAWN_PROMOTED,

        WHITE_KING,
        WHITE_ROOK,
        WHITE_BISHOP,
        WHITE_GOLD,
        WHITE_SILVER,
        WHITE_KNIGHT,
        WHITE_LANCE,
        WHITE_PAWN,

        WHITE_ROOK_PROMOTED,
        WHITE_BISHOP_PROMOTED,
        WHITE_SILVER_PROMOTED,
        WHITE_KNIGHT_PROMOTED,
        WHITE_LANCE_PROMOTED,
        WHITE_PAWN_PROMOTED,
      ][index % 29] ??0,
      moveTarget: false,
    })),
  );
  const [wasm] = createResource(getWasm);

  const setBoard = (board: readonly number[]): void => {
    setFullBoard(
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      produce((fullBoard) => {
        for (const [index, element] of fullBoard.entries()) {
          element.piece = board[index] ?? EMPTY;
        }
      }),
    );
  };

  const setMove = (moves: readonly number[]): void => {
    setFullBoard(
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      produce((fullBoard) => {
        for (const [index, element] of fullBoard.entries()) {
          element.moveTarget = moves[index] === MOVE_TARGET;
        }
      }),
    );
  };

  let resolve: (value: number) => void = doNothingFunction;
  const humanInput = new MultiPromise<number>((rs) => {
    resolve = rs;
  });

  let terminate = doNothingFunction;
  const start = (): void => {
    terminate();

    const wasmObject = wasm();
    if (wasmObject === undefined) {
      return;
    }
    terminate = gameLoop(wasmObject, doNothingFunction, setBoard, doNothingFunction, setMove, humanInput, {
      [BLACK]: playerBlack,
      [WHITE]: playerWhite,
    });
  };

  const handleBoardClick = (index: number): void => {
    resolve(index);
  };

  return (
    <>
      <ShogiBoard board={board} onSquareClick={handleBoardClick} />
      <button type="button" onClick={start}>
        Start
      </button>
    </>
  );
};
