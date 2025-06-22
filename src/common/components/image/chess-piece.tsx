import { arc, bezier, close, line, move, path } from "../../scripts/svg-path.ts";
import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK } from "./id.ts";
import { chessPiece } from "./style.css.ts";

import type { JSXElement } from "solid-js";

type PieceProperties = {
  /** チェスの駒の色 */
  readonly color: "black" | "white";
};

/**
 * キング
 * @param properties - プロパティ
 * @returns 要素
 */
export const King = (properties: PieceProperties): JSXElement => {
  return (
    <symbol id={`${KING}-${properties.color}`} viewBox="0 0 60 60">
      <g class={chessPiece[properties.color]}>
        <path d={path(move(15, 55), line(20, 25), line(40, 25), line(45, 55), close())} />
        <path
          d={path(
            move(24, 10),
            line(24, 6),
            line(27, 6),
            line(27, 3),
            line(33, 3),
            line(33, 6),
            line(36, 6),
            line(36, 10),
            close(),
          )}
        />
        <path d={path(move(20, 25), line(15, 10), line(45, 10), line(40, 25), close())} />
        <rect height="5" width="24" x="18" y="23" />
        <rect height="5" width="40" x="10" y="52" />
      </g>
    </symbol>
  );
};

/**
 * クイーン
 * @param properties - プロパティ
 * @returns 要素
 */
export const Queen = (properties: PieceProperties): JSXElement => {
  return (
    <symbol id={`${QUEEN}-${properties.color}`} viewBox="0 0 60 60">
      <g class={chessPiece[properties.color]}>
        <path d={path(move(22, 35), line(13, 55), line(47, 55), line(38, 35), close())} />
        <path d={path(move(22, 15), line(20, 13), arc(10, 6, 0, 0, 1, 40, 13), line(38, 15), close())} />
        <path
          d={path(
            move(22, 30),
            line(38, 30),
            line(42, 10),
            line(35, 15),
            line(30, 10),
            line(25, 15),
            line(18, 10),
            close(),
          )}
        />
        <circle cx="30" cy="5" r="2" />
        <rect height="5" width="20" x="20" y="30" />
        <rect height="5" width="40" x="10" y="52" />
      </g>
    </symbol>
  );
};

/**
 * ルーク
 * @param properties - プロパティ
 * @returns 要素
 */
export const Rook = (properties: PieceProperties): JSXElement => {
  return (
    <symbol id={`${ROOK}-${properties.color}`} viewBox="0 0 60 60">
      <g class={chessPiece[properties.color]}>
        <rect height="15" width="20" x="20" y="20" />
        <path d={path(move(20, 35), line(40, 35), line(45, 55), line(15, 55), close())} />
        <path
          d={path(
            move(15, 20),
            line(15, 10),
            line(20, 10),
            line(20, 15),
            line(25, 15),
            line(25, 10),
            line(45, 10),
            line(45, 20),
            close(),
          )}
        />
        <rect height="5" width="26" x="17" y="33" />
        <rect height="5" width="40" x="10" y="52" />
      </g>
    </symbol>
  );
};

/**
 * ビショップ
 * @param properties - プロパティ
 * @returns 要素
 */
export const Bishop = (properties: PieceProperties): JSXElement => {
  return (
    <symbol id={`${BISHOP}-${properties.color}`} viewBox="0 0 60 60">
      <g class={chessPiece[properties.color]}>
        <rect height="7" width="16" x="22" y="45" />
        <path d={path(move(20, 45), arc(22, 22, 0, 0, 1, 30, 8), arc(22, 22, 0, 0, 1, 40, 45), close())} />
        <path d={path(move(39, 13), line(30, 22))} />
        <circle cx="30" cy="8" r="3" />
        <rect height="5" width="40" x="10" y="52" />
      </g>
    </symbol>
  );
};

/**
 * ナイト
 * @param properties - プロパティ
 * @returns 要素
 */
export const Knight = (properties: PieceProperties): JSXElement => {
  return (
    <symbol id={`${KNIGHT}-${properties.color}`} viewBox="0 0 60 60">
      <g class={chessPiece[properties.color]}>
        <path d={path(move(45, 55), line(45, 20), arc(15, 15, 90, 0, 0, 30, 5), line(30, 55), close())} />
        <path
          d={path(
            move(40, 55),
            line(40, 20),
            arc(10, 10, 135, 0, 0, 23, 13),
            line(17, 19),
            arc(5, 5, 180, 0, 0, 17, 29),
            line(25, 29),
            bezier(25, 40, 15, 40, 15, 55),
            close(),
          )}
        />
        <circle cx="27" cy="18" r="1" />
        <rect height="5" width="40" x="10" y="52" />
      </g>
    </symbol>
  );
};

/**
 * ポーン
 * @param properties - プロパティ
 * @returns 要素
 */
export const Pawn = (properties: PieceProperties): JSXElement => {
  return (
    <symbol id={`${PAWN}-${properties.color}`} viewBox="0 0 60 60">
      <g class={chessPiece[properties.color]}>
        <path d={path(move(25, 20), line(35, 20), line(40, 55), line(20, 55), close())} />
        <circle cx="30" cy="20" r="10" />
        <rect height="5" width="20" x="20" y="27" />
        <rect height="5" width="40" x="10" y="52" />
      </g>
    </symbol>
  );
};
