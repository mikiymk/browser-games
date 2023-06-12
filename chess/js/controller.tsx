import { Setter } from "solid-js";
import { PlayerType, PlayerTypeAI, PlayerTypeHuman } from "../../common/types";
import { createReference } from "./reference";

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
      <button onClick={() => properties.reset()}>reset</button>
      <Settings
        playerWhite={properties.playerWhite}
        playerBlack={properties.playerBlack}
        setPlayerWhite={properties.setPlayerWhite}
        setPlayerBlack={properties.setPlayerWhite}
      />
    </div>
  );
};

type SettingsProperties = {
  playerWhite: PlayerType;
  playerBlack: PlayerType;
  setPlayerWhite: Setter<PlayerType>;
  setPlayerBlack: Setter<PlayerType>;
};
const Settings = (properties: SettingsProperties) => {
  const dialog = createReference<HTMLDialogElement>();

  const openSettings = () => {
    dialog.value?.showModal();
  };

  const closeSettings = () => {
    dialog.value?.close();
  };

  return (
    <>
      <button onClick={openSettings}>open settings</button>

      <dialog ref={dialog.setValue}>
        <h3>Settings</h3>

        <div>
          Black player
          <SettingPlayerSelect player={properties.playerBlack} setPlayer={properties.setPlayerBlack} />
        </div>
        <div>
          White player
          <SettingPlayerSelect player={properties.playerWhite} setPlayer={properties.setPlayerWhite} />
        </div>

        <button onClick={closeSettings}>Close</button>
      </dialog>
    </>
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
