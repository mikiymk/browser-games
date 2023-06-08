import { Setter } from "solid-js";
import { PlayerType, PlayerTypeAI, PlayerTypeHuman } from "../../common/types";

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
  let dialog: HTMLDialogElement | undefined;
  const dialogReference = (element: HTMLDialogElement) => {
    dialog = element;
  };

  const openSettings = () => {
    dialog?.showModal();
  };

  const closeSettings = () => {
    dialog?.close();
  };

  return (
    <>
      <button onClick={openSettings}>open settings</button>

      <dialog ref={dialogReference}>
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
