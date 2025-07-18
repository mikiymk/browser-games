import { SettingItem, Settings } from "../../../common/components/header-buttons/settings.tsx";
import { InputNumber } from "../../../common/components/input/number.tsx";
import { TEXT_HEIGHT, TEXT_MINES_COUNT, TEXT_WIDTH } from "../../../common/scripts/constants.ts";

import type { JSXElement, Setter } from "solid-js";

type Properties = {
  readonly height: number;
  readonly mineCount: number;
  readonly setHeight: Setter<number>;

  readonly setMineCount: Setter<number>;
  readonly setWidth: Setter<number>;
  readonly width: number;
};
export const MineSweeperSettings = (properties: Properties): JSXElement => {
  return (
    <Settings>
      <SettingItem label={TEXT_HEIGHT}>
        <InputNumber name="height" setValue={properties.setHeight} value={properties.height} />
      </SettingItem>
      <SettingItem label={TEXT_WIDTH}>
        <InputNumber name="width" setValue={properties.setWidth} value={properties.width} />
      </SettingItem>
      <SettingItem label={TEXT_MINES_COUNT}>
        <InputNumber name="mine-count" setValue={properties.setMineCount} value={properties.mineCount} />
      </SettingItem>
    </Settings>
  );
};
