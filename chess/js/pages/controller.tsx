import { SettingModal } from "@/common/setting-modal";
import { PlayerTypeAI, PlayerTypeHuman } from "@/common/types";

import type { PlayerType } from "@/common/types";
import type { Setter } from "solid-js";

type ControllerProperties = {
  statusMessage: string;
  reset: () => void;

  playerWhite: PlayerType;
  playerBlack: PlayerType;
  setPlayerWhite: Setter<PlayerType>;
  setPlayerBlack: Setter<PlayerType>;
};

export const Controller = (properties: ControllerProperties) => {
  return (
    <div>
      status:
      <output>{properties.statusMessage}</output>
      <button
        type="button"
        onClick={() => {
          properties.reset();
        }}
      >
        reset
      </button>
      <SettingModal>
        <div>
          Black player
          <SettingPlayerSelect player={properties.playerBlack} setPlayer={properties.setPlayerBlack} />
        </div>
        <div>
          White player
          <SettingPlayerSelect player={properties.playerWhite} setPlayer={properties.setPlayerWhite} />
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
      onChange={(event) => {
        console.log(event.currentTarget.value);
        properties.setPlayer(Number(event.currentTarget.value) === PlayerTypeHuman ? PlayerTypeHuman : PlayerTypeAI);
      }}
    >
      <option value={PlayerTypeHuman}>Human</option>
      <option value={PlayerTypeAI}>AI</option>
    </select>
  );
};
