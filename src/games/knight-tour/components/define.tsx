import type { JSXElement } from "solid-js";
import { DefineNumber } from "../../../components/define/define-number.ts";
import { DefineUse } from "../../../components/define/define-use.ts";
import { Define } from "../../../components/define/define.ts";
import { Use } from "../../../components/define/use.ts";
import knight from "../../../images/chess/knight.svg";
import cross from "../../../images/icon/cross.svg";
import nought from "../../../images/icon/nought.svg";
import Styles from "./style.module.css";

export const DefineSymbol = (): JSXElement => {
  return (
    <Define>
      <DefineNumber number={0} class={Styles.number} />
      <DefineNumber number={1} class={Styles.number} />
      <DefineNumber number={2} class={Styles.number} />
      <DefineNumber number={3} class={Styles.number} />
      <DefineNumber number={4} class={Styles.number} />
      <DefineNumber number={5} class={Styles.number} />
      <DefineNumber number={6} class={Styles.number} />
      <DefineNumber number={7} class={Styles.number} />

      <DefineUse id="knight" href={knight.src} class={Styles.knight} />
      <DefineUse id="nought" href={nought.src} class={Styles.figure} />
      <DefineUse id="cross" href={cross.src} class={Styles.figure} />
    </Define>
  );
};

export const UsePiece = Use<number | "cross" | "knight" | "nought" | undefined>;
