import { Use } from "@/components/define/use";
import type { JSXElement } from "solid-js";
import { COLOR_KING_BLACK, COLOR_KING_WHITE, COLOR_PAWN_BLACK, COLOR_PAWN_WHITE, MOVE_TARGET } from "../constants";
import Styles from "./style.module.css";

const WHITE_PAWN_ID = "white-pawn";
const WHITE_KING_ID = "white-king";
const BLACK_PAWN_ID = "black-pawn";
const BLACK_KING_ID = "black-king";

export const DefinePieces = (): JSXElement => {
  return (
    <svg viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg" class={Styles.define}>
      <title>define stones</title>

      <symbol id={WHITE_PAWN_ID} viewBox="0 0 60 60">
        <circle cx={30} cy={30} r={25} class={Styles["stone-white"]} />
      </symbol>

      <symbol id={WHITE_KING_ID} viewBox="0 0 60 60">
        <circle cx={30} cy={30} r={25} class={Styles["stone-white"]} />
        <circle cx={30} cy={30} r={15} class={Styles["stone-white"]} />
      </symbol>

      <symbol id={BLACK_PAWN_ID} viewBox="0 0 60 60">
        <circle cx={30} cy={30} r={25} class={Styles["stone-black"]} />
      </symbol>

      <symbol id={BLACK_KING_ID} viewBox="0 0 60 60">
        <circle cx={30} cy={30} r={25} class={Styles["stone-black"]} />
        <circle cx={30} cy={30} r={15} class={Styles["stone-black"]} />
      </symbol>

      <symbol id="move" viewBox="0 0 60 60">
        <circle cx={30} cy={30} r={15} class={Styles["stone-move"]} />
      </symbol>
    </svg>
  );
};

type UsePieceProperties = {
  readonly piece: number;

  readonly x: number;
  readonly y: number;
};
export const UsePiece = (properties: UsePieceProperties): JSXElement => {
  const id = (): string | undefined => {
    const ids: Record<number, string> = {
      [COLOR_PAWN_WHITE]: WHITE_PAWN_ID,
      [COLOR_KING_WHITE]: WHITE_KING_ID,
      [COLOR_PAWN_BLACK]: BLACK_PAWN_ID,
      [COLOR_KING_BLACK]: BLACK_KING_ID,
      [MOVE_TARGET]: "move",
    };

    return ids[properties.piece];
  };

  return <Use id={id()} x={properties.x} y={properties.y} />;
};
