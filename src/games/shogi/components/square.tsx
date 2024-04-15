import ginShoKanji from "@/images/shogi/gin-sho.svg";
import gyokuShoKanji from "@/images/shogi/gyoku-sho.svg";
import hiShaKanji from "@/images/shogi/hi-sha.svg";
import huHyoKanji from "@/images/shogi/hu-hyo.svg";
import kakuGyoKanji from "@/images/shogi/kaku-gyo.svg";
import keiMaKanji from "@/images/shogi/kei-ma.svg";
import kinShoKanji from "@/images/shogi/kin-sho.svg";
import kyoShaKanji from "@/images/shogi/kyo-sha.svg";
import nariGinKanji from "@/images/shogi/nari-gin.svg";
import nariKeiKanji from "@/images/shogi/nari-kei.svg";
import nariKyoKanji from "@/images/shogi/nari-kyo.svg";
import oShoKanji from "@/images/shogi/o-sho.svg";
import piece from "@/images/shogi/piece.svg";
import ryuMeKanji from "@/images/shogi/ryu-me.svg";
import ryuoKanji from "@/images/shogi/ryu-o.svg";
import toKinKanji from "@/images/shogi/to-kin.svg";
import { Show } from "solid-js";
import type { JSXElement } from "solid-js";
import { BISHOP, COLOR, GOLD, KING, KNIGHT, LANCE, PAWN, PIECE, PROMOTED, ROOK, SILVER } from "../constants";
import { kanjiStyle, moveTargetStyle, pieceStyle, redKanjiStyle } from "../style.css";

type SquareProperties = {
  readonly x: number;
  readonly y: number;

  readonly square: number;
  readonly move: boolean;
};
export const Square = (properties: SquareProperties): JSXElement => {
  const source = (): string | undefined => {
    if (!properties.square) {
      return;
    }

    switch (properties.square & (PIECE | PROMOTED)) {
      case KING:
        return properties.square & COLOR ? gyokuShoKanji.src : oShoKanji.src;
      case ROOK:
        return hiShaKanji.src;
      case ROOK | PROMOTED:
        return ryuoKanji.src;
      case BISHOP:
        return kakuGyoKanji.src;
      case BISHOP | PROMOTED:
        return ryuMeKanji.src;
      case GOLD:
        return kinShoKanji.src;
      case SILVER:
        return ginShoKanji.src;
      case SILVER | PROMOTED:
        return nariGinKanji.src;
      case KNIGHT:
        return keiMaKanji.src;
      case KNIGHT | PROMOTED:
        return nariKeiKanji.src;
      case LANCE:
        return kyoShaKanji.src;
      case LANCE | PROMOTED:
        return nariKyoKanji.src;
      case PAWN:
        return huHyoKanji.src;
      case PAWN | PROMOTED:
        return toKinKanji.src;

      default:
        return;
    }
  };

  const style = (): string => {
    return properties.square & PROMOTED ? redKanjiStyle : kanjiStyle;
  };

  const rotate = (): string => {
    return properties.square & COLOR ? "" : `rotate(180, ${properties.x + 5}, ${properties.y + 5})`;
  };

  return (
    <>
      <Show when={properties.move}>
        <rect x={properties.x + 1} y={properties.y + 1} height={8} width={8} class={moveTargetStyle} />
      </Show>
      <Show when={source()}>
        {(source) => (
          <>
            <use
              href={`${piece.src}#root`}
              height={10}
              width={10}
              x={properties.x}
              y={properties.y}
              class={pieceStyle}
              transform={rotate()}
            />
            <use
              href={`${source()}#root`}
              height={10}
              width={10}
              x={properties.x}
              y={properties.y}
              class={style()}
              transform={rotate()}
            />
          </>
        )}
      </Show>
    </>
  );
};
