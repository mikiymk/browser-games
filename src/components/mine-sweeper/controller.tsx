import { SettingModal } from "@/components/common/setting-modal";

type ControllerProperties = {
  height: number;
  width: number;
  mineAmount: number;

  message: string;

  reset: () => void;
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
  setMineAmount: (amount: number) => void;
};

export const Controller = (properties: ControllerProperties) => {
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
            <input
              type="number"
              min={4}
              value={properties.height}
              onChange={(event) => {
                properties.setHeight(Number(event.currentTarget.value));
              }}
            />
          </label>
          <br />
          4 ～
        </p>
        <p>
          <label>
            width:
            <input
              type="number"
              min={4}
              value={properties.width}
              onChange={(event) => {
                properties.setWidth(Number(event.currentTarget.value));
              }}
            />
          </label>
          <br />
          4 ～
        </p>
        <p>
          <label>
            number of mines:
            <input
              type="number"
              min={1}
              max={properties.height * properties.width - 9}
              value={properties.mineAmount}
              onChange={(event) => {
                properties.setMineAmount(Number(event.currentTarget.value));
              }}
            />
          </label>
          <br />
          1 ～ {properties.height * properties.width - 9}
        </p>
      </SettingModal>
    </div>
  );
};
