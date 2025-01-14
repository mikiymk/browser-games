import { InputNumber } from "@/components/input/number";
import { HeaderPopup } from "@/components/page-header/header-popup";
import { TEXT_HEIGHT, TEXT_MINES_COUNT, TEXT_SETTINGS, TEXT_WIDTH } from "@/scripts/constants";
import type { JSXElement, Setter } from "solid-js";

type SettingsProperties = {
  readonly height: number;
  readonly width: number;
  readonly mineCount: number;

  readonly setHeight: Setter<number>;
  readonly setWidth: Setter<number>;
  readonly setMineCount: Setter<number>;
};
export const Settings = (properties: SettingsProperties): JSXElement => {
  return (
    <HeaderPopup icon="settings" label={TEXT_SETTINGS}>
      <h2>{TEXT_SETTINGS}</h2>

      <dl class="grid grid-cols-2">
        <dt>{TEXT_HEIGHT}</dt>
        <dd>
          <InputNumber name="height" value={properties.height} setValue={properties.setHeight} />
        </dd>

        <dt>{TEXT_WIDTH}</dt>
        <dd>
          <InputNumber name="width" value={properties.width} setValue={properties.setWidth} />
        </dd>

        <dt>{TEXT_MINES_COUNT}</dt>
        <dd>
          <InputNumber name="mine-count" value={properties.mineCount} setValue={properties.setMineCount} />
        </dd>
      </dl>
    </HeaderPopup>
  );
};
