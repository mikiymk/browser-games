import type { JSXElement } from "solid-js";

import { Close } from "@corvu/dialog";
import { createSignal } from "solid-js";

import type { Select } from "../klondike.ts";

import { InformationPopUp } from "../../../common/components/page-frame/information-popup.tsx";
import { Page } from "../../../common/components/page-frame/page.tsx";
import { Start } from "../../../components/header-buttons/start.tsx";
import { createKlondike } from "../klondike.ts";
import { Field } from "./field.tsx";

export const App = (): JSXElement => {
  const { autoFoundation, cards, isCleared, moveCards, openStock, start } = createKlondike();
  const [select, setSelect] = createSignal<Select | undefined>();
  const [popText, setPopText] = createSignal<string | undefined>();

  /** 山札をクリックしたときの関数 */
  const selectStock = (): void => {
    setSelect({ type: "stock" });
  };

  /** 場札をクリックしたときの関数 */
  const selectTableau = (index: number, depth: number): void => {
    const current: Select = { depth, index, type: "tableau" };

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
    const current: Select = { index, type: "foundation" };

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
    <Page header={<Start start={start} />}>
      <Field
        {...cards}
        autoFoundation={autoFoundation}
        openStock={openStock}
        select={select()}
        selectFoundation={selectFoundation}
        selectStock={selectStock}
        selectTableau={selectTableau}
      />

      <InformationPopUp open={popText() !== undefined}>
        {popText()}
        <Close
          onClick={() => {
            setPopText();
          }}
        >
          close
        </Close>
      </InformationPopUp>
    </Page>
  );
};
