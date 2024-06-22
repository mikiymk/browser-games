import piece from "@/images/shogi/piece.svg";
import type { JSXElement } from "solid-js";

export const Define = (): JSXElement => {
  return (
    <svg viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg" class="hidden">
      <title>define cards</title>

      <DefinePiece id="王将" pieces={["王", "将"]} />
      <DefinePiece id="玉将" pieces={["玉", "将"]} />
      <DefinePiece id="飛車" pieces={["飛", "車"]} />
      <DefinePiece id="角行" pieces={["角", "行"]} />
      <DefinePiece id="金将" pieces={["金", "将"]} />
      <DefinePiece id="銀将" pieces={["銀", "将"]} />
      <DefinePiece id="桂馬" pieces={["桂", "馬"]} />
      <DefinePiece id="香車" pieces={["香", "車"]} />
      <DefinePiece id="歩兵" pieces={["歩", "兵"]} />
      <DefinePiece id="龍王" pieces={["龍", "王"]} promoted />
      <DefinePiece id="龍馬" pieces={["龍", "馬"]} promoted />
      <DefinePiece id="成銀" pieces={["成", "銀"]} promoted />
      <DefinePiece id="成桂" pieces={["成", "桂"]} promoted />
      <DefinePiece id="成香" pieces={["成", "香"]} promoted />
      <DefinePiece id="と金" pieces={["と", "金"]} promoted />
    </svg>
  );
};

type DefinePieceProperties = {
  readonly id: string;
  readonly pieces: readonly [char1: string, char2: string];
  readonly promoted?: boolean;
};

const DefinePiece = (properties: DefinePieceProperties): JSXElement => {
  return (
    <symbol id={properties.id} viewBox="0 0 60 60">
      <use href={`${piece.src}#root`} height={60} width={60} class="fill-yellow-300 stroke-slate-900" />
      <text
        x="30"
        y="28"
        class={`font-noto-jp text-[20px] anchor-mid ${properties.promoted === true ? "fill-red-600" : "fill-slate-900"}`}
      >
        {properties.pieces[0]}
      </text>
      <text
        x="30"
        y="50"
        class={`font-noto-jp text-[20px] anchor-mid ${properties.promoted === true ? "fill-red-600" : "fill-slate-900"}`}
      >
        {properties.pieces[1]}
      </text>
    </symbol>
  );
};

type UsePieceProperties = {
  readonly x: number;
  readonly y: number;

  readonly piece: string;
  readonly rotate: boolean;
};
export const UsePiece = (properties: UsePieceProperties): JSXElement => {
  return (
    <use
      href={`#${properties.piece}`}
      height={10}
      width={10}
      x={properties.x}
      y={properties.y}
      transform={properties.rotate ? "" : `rotate(180, ${properties.x + 5}, ${properties.y + 5})`}
    />
  );
};
