import { Start } from "../../../common/components/header-buttons/start.tsx";
import { Page } from "../../../common/components/page-frame/page.tsx";
import { createUrlQuerySignalNumber } from "../../../common/scripts/use-url-query.ts";
import { createMineSweeperGame } from "../game.ts";
import { Status } from "./controller.tsx";
import { MineFields } from "./field.tsx";
import { MineSweeperSettings } from "./settings.tsx";

import type { JSXElement } from "solid-js";

export const App = (): JSXElement => {
  const [height, setHeight] = createUrlQuerySignalNumber("height", 10);
  const [width, setWidth] = createUrlQuerySignalNumber("width", 10);
  const [mineCount, setMineCount] = createUrlQuerySignalNumber("mines", 10);
  const { fields, flagField, gameState, openField, reset } = createMineSweeperGame(height, width, mineCount);

  return (
    <Page
      header={
        <>
          <Status fields={fields()} mines={mineCount()} state={gameState()} />
          <Start start={reset} />
          <MineSweeperSettings
            height={height()}
            mineCount={mineCount()}
            setHeight={setHeight}
            setMineCount={setMineCount}
            setWidth={setWidth}
            width={width()}
          />
        </>
      }
    >
      <MineFields fields={fields()} flag={flagField} height={height()} open={openField} width={width()} />
    </Page>
  );
};
