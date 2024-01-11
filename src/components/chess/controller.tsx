import {
  Black,
  End5Repetition,
  End75Moves,
  EndBlackWin,
  EndInsufficientMaterial,
  EndStalemate,
  EndWhiteWin,
} from "@/games/chess/constants";
import { PlayerTypeAi, PlayerTypeHuman } from "@/scripts/player";
import type { PlayerType } from "@/scripts/player";
import type { JSXElement, Setter } from "solid-js";

type SettingPlayerSelectProperties = {
  readonly player: PlayerType;
  readonly setPlayer: Setter<PlayerType>;
};
const SettingPlayerSelect = (properties: SettingPlayerSelectProperties): JSXElement => {
  const handleChange = (event: { readonly currentTarget: HTMLSelectElement }): void => {
    console.log(event.currentTarget.value);
    properties.setPlayer(Number(event.currentTarget.value) === PlayerTypeHuman ? PlayerTypeHuman : PlayerTypeAi);
  };

  return (
    <select value={properties.player} onChange={handleChange}>
      <option value={PlayerTypeHuman}>Human</option>
      <option value={PlayerTypeAi}>AI</option>
    </select>
  );
};

type ControllerProperties = {
  readonly color: number;
  readonly end: number;

  readonly start: () => void;

  readonly playerWhite: PlayerType;
  readonly playerBlack: PlayerType;
  readonly setPlayerWhite: Setter<PlayerType>;
  readonly setPlayerBlack: Setter<PlayerType>;
};

export const Controller = (properties: ControllerProperties): JSXElement => {
  const message = (): string => {
    switch (properties.end) {
      case EndBlackWin: {
        return "black win";
      }
      case EndWhiteWin: {
        return "white win";
      }
      case EndStalemate: {
        return "draw - stalemate";
      }
      case End75Moves: {
        return "draw - Seventy-five-move";
      }
      case End5Repetition: {
        return "draw - Fivefold repetition";
      }
      case EndInsufficientMaterial: {
        return "draw - Insufficient material";
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
