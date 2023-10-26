import { SettingModal } from "@/components/common/setting-modal";
import { PlayerTypeAI, PlayerTypeHuman } from "@/scripts/player";

import type { PlayerType } from "@/scripts/player";
import type { Setter } from "solid-js";

type ControllerProperties = {
  statusMessage: string;
  onReset: () => void;

  playerO: PlayerType;
  playerX: PlayerType;
  setPlayerO: Setter<PlayerType>;
  setPlayerX: Setter<PlayerType>;
};
export const Controller = (properties: ControllerProperties) => {
  return (
    <div>
      status:
      <output>{properties.statusMessage}</output>
      <button
        type="button"
        onClick={() => {
          properties.onReset();
        }}
      >
        reset
      </button>
      <SettingModal>
        <div>
          ◯ player
          <SettingPlayerSelect player={properties.playerO} setPlayer={properties.setPlayerO} />
        </div>
        <div>
          ✗ player
          <SettingPlayerSelect player={properties.playerX} setPlayer={properties.setPlayerX} />
        </div>
      </SettingModal>
    </div>
  );
};

type SettingPlayerSelectProperties = {
  player: PlayerType;
  setPlayer: Setter<PlayerType>;
};
const SettingPlayerSelect = (properties: SettingPlayerSelectProperties) => {
  return (
    <select
      value={properties.player}
      onChange={(event) =>
        properties.setPlayer(Number(event.currentTarget.value) === PlayerTypeHuman ? PlayerTypeHuman : PlayerTypeAI)
      }
    >
      <option value={PlayerTypeHuman}>Human</option>
      <option value={PlayerTypeAI}>AI</option>
    </select>
  );
};
