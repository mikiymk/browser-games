import { EndBlackWin, EndDraw, EndWhiteWin } from "@/games/chess/constants";
import { Black } from "@/games/chess/types";
import { PlayerTypeAI, PlayerTypeHuman } from "@/scripts/player";

import type { PlayerType } from "@/scripts/player";
import type { Setter } from "solid-js";

type ControllerProperties = {
  color: number;
  end: number;

  start: () => void;

  playerWhite: PlayerType;
  playerBlack: PlayerType;
  setPlayerWhite: Setter<PlayerType>;
  setPlayerBlack: Setter<PlayerType>;
};

export const Controller = (properties: ControllerProperties) => {
  const message = () => {
    switch (properties.end) {
      case EndBlackWin: {
        return "black win";
      }
      case EndWhiteWin: {
        return "white win";
      }
      case EndDraw: {
        return "draw";
      }
      default: {
        return properties.color === Black ? "black" : "white";
      }
    }
  };
  return (
    <div>
      status:
      <output>{message()}</output>
      <button
        type="button"
        onClick={() => {
          properties.start();
        }}
      >
        reset
      </button>

      <div>
        Black player
        <SettingPlayerSelect player={properties.playerBlack} setPlayer={properties.setPlayerBlack} />
      </div>
      <div>
        White player
        <SettingPlayerSelect player={properties.playerWhite} setPlayer={properties.setPlayerWhite} />
      </div>
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
