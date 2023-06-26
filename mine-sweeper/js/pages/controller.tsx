import { SettingModal } from "@/common/setting-modal";

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
      <button onClick={() => properties.reset()}>reset</button>
      <SettingModal>
        <p>
          <label>
            height:
            <input
              type="number"
              value={properties.height}
              onChange={(event) => properties.setHeight(Number(event.currentTarget.value))}
            />
          </label>
        </p>
        <p>
          <label>
            width:
            <input
              type="number"
              value={properties.width}
              onChange={(event) => properties.setWidth(Number(event.currentTarget.value))}
            />
          </label>
        </p>
        <p>
          <label>
            number of mines:
            <input
              type="number"
              value={properties.mineAmount}
              onChange={(event) => properties.setMineAmount(Number(event.currentTarget.value))}
            />
          </label>
        </p>
      </SettingModal>
    </div>
  );
};
