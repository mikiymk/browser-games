import { SettingModal } from "@/components/common/setting-modal";
import type { JSXElement } from "solid-js";

type ControllerProperties = {
  readonly height: number;
  readonly width: number;
  readonly mineAmount: number;

  readonly message: string;

  readonly reset: () => void;
  readonly setHeight: (height: number) => void;
  readonly setWidth: (width: number) => void;
  readonly setMineAmount: (amount: number) => void;
};

export const Controller = (properties: ControllerProperties): JSXElement => {
  const handleHeight = (event: { readonly currentTarget: HTMLInputElement }): void => {
    properties.setHeight(Number(event.currentTarget.value));
  };
  const handleWidth = (event: { readonly currentTarget: HTMLInputElement }): void => {
    properties.setWidth(Number(event.currentTarget.value));
  };
  const handleMines = (event: { readonly currentTarget: HTMLInputElement }): void => {
    properties.setMineAmount(Number(event.currentTarget.value));
  };

  return (
    <div>
      status:
      <output>{properties.message}</output>
      <button
        type="button"
        onClick={() => {
          properties.reset();
        }}
      >
        reset
      </button>
      <SettingModal>
        <p>
          <label>
            height:
            <input type="number" min={4} value={properties.height} onChange={handleHeight} />
          </label>
          <br />4 ～
        </p>
        <p>
          <label>
            width:
            <input type="number" min={4} value={properties.width} onChange={handleWidth} />
          </label>
          <br />4 ～
        </p>
        <p>
          <label>
            number of mines:
            <input
              type="number"
              min={1}
              max={properties.height * properties.width - 9}
              value={properties.mineAmount}
              onChange={handleMines}
            />
          </label>
          <br />1 ～ {properties.height * properties.width - 9}
        </p>
      </SettingModal>
    </div>
  );
};
