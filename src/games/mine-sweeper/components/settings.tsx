import { Item, Settings } from "@/components/header-buttons/settings";
import { InputNumber } from "@/components/input/number";
import { TEXT_HEIGHT, TEXT_MINES_COUNT, TEXT_WIDTH } from "@/scripts/constants";
import type { JSXElement, Setter } from "solid-js";

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
      <Item
        label={TEXT_HEIGHT}
        input={<InputNumber name="height" value={properties.height} setValue={properties.setHeight} />}
      />
      <Item
        label={TEXT_WIDTH}
        input={<InputNumber name="width" value={properties.width} setValue={properties.setWidth} />}
      />
      <Item
        label={TEXT_MINES_COUNT}
        input={<InputNumber name="mine-count" value={properties.mineCount} setValue={properties.setMineCount} />}
      />
    </Settings>
  );
};
