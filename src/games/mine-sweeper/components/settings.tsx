import type { JSXElement, Setter } from "solid-js";
import { SettingItem, Settings } from "../../../components/header-buttons/settings.tsx";
import { InputNumber } from "../../../components/input/number.tsx";
import { TEXT_HEIGHT, TEXT_MINES_COUNT, TEXT_WIDTH } from "../../../scripts/constants.ts";

type Properties = {
  readonly height: number;
  readonly width: number;
  readonly mineCount: number;

  readonly setHeight: Setter<number>;
  readonly setWidth: Setter<number>;
  readonly setMineCount: Setter<number>;
};
export const MineSweeperSettings = (properties: Properties): JSXElement => {
  return (
    <Settings>
      <SettingItem label={TEXT_HEIGHT}>
        <InputNumber name="height" value={properties.height} setValue={properties.setHeight} />
      </SettingItem>
      <SettingItem label={TEXT_WIDTH}>
        <InputNumber name="width" value={properties.width} setValue={properties.setWidth} />
      </SettingItem>
      <SettingItem label={TEXT_MINES_COUNT}>
        <InputNumber name="mine-count" value={properties.mineCount} setValue={properties.setMineCount} />
      </SettingItem>
    </Settings>
  );
};
