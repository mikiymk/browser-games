import { HeaderButton } from "@/components/page-header/header-button";
import { PopUp } from "@/games/shogi/components/pop-up";
import type { JSXElement, Setter } from "solid-js";
import { createSignal } from "solid-js";
import { InputNumber } from "@/components/input/number";

type SettingsProperties = {
  readonly height: number;
  readonly width: number;
  readonly mineCount: number;

  readonly setHeight: Setter<number>;
  readonly setWidth: Setter<number>;
  readonly setMineCount: Setter<number>;
};
export const Settings = (properties: SettingsProperties): JSXElement => {
  const [open, setOpen] = createSignal(false);

  return (
    <button
      type="button"
      onClick={() => {
        setOpen(true);
      }}
    >
      <HeaderButton icon="settings">Settings</HeaderButton>

      <PopUp
        open={open()}
        outerClick={() => {
          setOpen(false);
        }}
      >
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
      </PopUp>
    </button>
  );
};
