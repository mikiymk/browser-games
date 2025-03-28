import { createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import { Button } from "../../../components/elements/button.tsx";
import { Start } from "../../../components/header-buttons/start.tsx";
import { PageBody } from "../../../components/page/body.tsx";
import { PageHeader } from "../../../components/page/header.tsx";
import { PopUp } from "../../../components/pop-up/pop-up.tsx";
import { createKlondike } from "../klondike.ts";
import type { Select } from "../klondike.ts";
import { Field } from "./field.tsx";

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
      <PageHeader buttons={<Start start={start} />} />

      <PageBody>
        <Field
          {...cards}
          select={select()}
          openStock={openStock}
          selectStock={selectStock}
          selectTableau={selectTableau}
          selectFoundation={selectFoundation}
          autoFoundation={autoFoundation}
        />

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
      </PageBody>
    </>
  );
};
