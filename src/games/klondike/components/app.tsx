import { createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import { Button } from "@/components/button";
import { Field } from "./field";
import { PopUp } from "@/games/shogi/components/pop-up";
import { createKlondike } from "../klondike";
import type { Select } from "../klondike";

export const App = (): JSXElement => {
  const { start, cards, moveCards, openStock, autoFoundation, isCleared } = createKlondike();
  const [select, setSelect] = createSignal<Select | undefined>();
  const [popText, setPopText] = createSignal<string | undefined>();

  /** 山札をクリックしたときの関数 */
  const selectStock = (): void => {
    setSelect({ type: "stock" });
  };

  /** 場札をクリックしたときの関数 */
  const selectTableau = (index: number, depth: number): void => {
    const current: Select = { type: "tableau", index, depth };

    if (moveCards(select(), current)) {
      setSelect();
      if (isCleared()) {
        setPopText("cleared!");
      }
    } else {
      setSelect(current);
    }
  };

  /** 組札をクリックしたときの関数 */
  const selectFoundation = (index: number): void => {
    const current: Select = { type: "foundation", index };

    if (moveCards(select(), current)) {
      setSelect();
      if (isCleared()) {
        setPopText("cleared!");
      }
    } else {
      setSelect(current);
    }
  };

  return (
    <>
      <Field
        {...cards}
        select={select()}
        openStock={openStock}
        selectStock={selectStock}
        selectTableau={selectTableau}
        selectFoundation={selectFoundation}
        autoFoundation={autoFoundation}
      />
      <Button onClick={start}>Start</Button>

      <PopUp open={popText() !== undefined}>
        {popText()}
        <br />
        <Button
          onClick={() => {
            setPopText();
          }}
        >
          Close
        </Button>
      </PopUp>
    </>
  );
};
