import { Show } from "solid-js";
import type { JSXElement } from "solid-js";
import piece from "@/images/shogi/piece.svg";
import oShoKanji from "@/images/shogi/o-sho.svg";
import gyokuShoKanji from "@/images/shogi/gyoku-sho.svg";
import hiShaKanji from "@/images/shogi/hi-sha.svg";
import kakuGyoKanji from "@/images/shogi/kaku-gyo.svg";
import kinShoKanji from "@/images/shogi/kin-sho.svg";
import ginShoKanji from "@/images/shogi/gin-sho.svg";
import keiMaKanji from "@/images/shogi/kei-ma.svg";
import kyoShaKanji from "@/images/shogi/kyo-sha.svg";
import huHyoKanji from "@/images/shogi/hu-hyo.svg";
import ryuoKanji from "@/images/shogi/ryu-o.svg";
import ryuMeKanji from "@/images/shogi/ryu-me.svg";
import nariGinKanji from "@/images/shogi/nari-gin.svg";
import nariKeiKanji from "@/images/shogi/nari-kei.svg";
import nariKyoKanji from "@/images/shogi/nari-kyo.svg";
import toKinKanji from "@/images/shogi/to-kin.svg";
import { kanjiStyle, pieceStyle, redKanjiStyle } from "../style.css";
import {
  Ginsyo,
  Gyokusyo,
  Hisya,
  Huhyo,
  Kakugyo,
  Keima,
  Kinsyo,
  Kyosya,
  NariGin,
  NariKei,
  NariKyo,
  Osyo,
  Ryuma,
  Ryuo,
  Tokin,
} from "../constants";

type SquareProperties = {
  readonly x: number;
  readonly y: number;

  readonly square: number;
};
export const Square = (properties: SquareProperties): JSXElement => {
  const source = (): string | undefined => {
    switch (properties.square) {
      case Osyo:
        return oShoKanji.src;
      case Gyokusyo:
        return gyokuShoKanji.src;
      case Hisya:
        return hiShaKanji.src;
      case Kakugyo:
        return kakuGyoKanji.src;
      case Kinsyo:
        return kinShoKanji.src;
      case Ginsyo:
        return ginShoKanji.src;
      case Keima:
        return keiMaKanji.src;
      case Kyosya:
        return kyoShaKanji.src;
      case Huhyo:
        return huHyoKanji.src;
      case Ryuo:
        return ryuoKanji.src;
      case Ryuma:
        return ryuMeKanji.src;
      case NariGin:
        return nariGinKanji.src;
      case NariKei:
        return nariKeiKanji.src;
      case NariKyo:
        return nariKyoKanji.src;
      case Tokin:
        return toKinKanji.src;
      default:
        return;
    }
  };

  const style = (): string => {
    switch (properties.square) {
      case Ryuo:
      case Ryuma:
      case NariGin:
      case NariKei:
      case NariKyo:
      case Tokin:
        return redKanjiStyle;
      default:
        return kanjiStyle;
    }
  };

  return (
    <>
      <Show when={properties.square}>
        <use href={`${piece.src}#root`} height={10} width={10} x={properties.x} y={properties.y} class={pieceStyle} />
      </Show>
      <Show when={source()}>
        {(source) => (
          <use href={`${source()}#root`} height={10} width={10} x={properties.x} y={properties.y} class={style()} />
        )}
      </Show>
    </>
  );
};
