import { InputNumber } from "@/components/input/number";
import { HeaderPopup } from "@/components/page-header/header-popup";
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
    <HeaderPopup icon="settings" label="Settings">
      <h2>Settings</h2>

      <dl class="grid grid-cols-2">
        <dt>Height</dt>
        <dd>
          <InputNumber name="height" value={properties.height} setValue={properties.setHeight} />
        </dd>

        <dt>Width</dt>
        <dd>
          <InputNumber name="width" value={properties.width} setValue={properties.setWidth} />
        </dd>

        <dt>Mines count</dt>
        <dd>
          <InputNumber name="mine-count" value={properties.mineCount} setValue={properties.setMineCount} />
        </dd>
      </dl>
    </HeaderPopup>
  );
};
