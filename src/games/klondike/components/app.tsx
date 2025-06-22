import { Close } from "@corvu/dialog";

import { Start } from "../../../common/components/header-buttons/start.tsx";
import { InformationPopUp } from "../../../common/components/page-frame/information-popup.tsx";
import { Page } from "../../../common/components/page-frame/page.tsx";
import { createKlondikeGame } from "../game.ts";
import { Field } from "./field.tsx";

import type { JSXElement } from "solid-js";

export const App = (): JSXElement => {
  const {
    autoFoundation,
    foundations,
    openStock,
    popText,
    select,
    selectFoundation,
    selectStock,
    selectTableau,
    setPopText,
    start,
    stock,
    tableaus,
  } = createKlondikeGame();

  return (
    <Page header={<Start start={start} />}>
      <Field
        autoFoundation={autoFoundation}
        foundations={foundations}
        openStock={openStock}
        select={select()}
        selectFoundation={selectFoundation}
        selectStock={selectStock}
        selectTableau={selectTableau}
        stock={stock}
        tableaus={tableaus}
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
