import { Setter } from "solid-js";
import { PlayerType, PlayerTypeHuman, PlayerTypeAI } from "@/common/types";

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
      <button onClick={() => properties.onReset()}>reset</button>
      <SettingModal
        playerO={properties.playerO}
        playerX={properties.playerX}
        setPlayerO={properties.setPlayerO}
        setPlayerX={properties.setPlayerX}
      />
    </div>
  );
};

type SettingModalProperties = {
  playerO: PlayerType;
  playerX: PlayerType;
  setPlayerO: Setter<PlayerType>;
  setPlayerX: Setter<PlayerType>;
};
const SettingModal = (properties: SettingModalProperties) => {
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
          ◯ player
          <SettingPlayerSelect player={properties.playerO} setPlayer={properties.setPlayerO} />
        </div>
        <div>
          ✗ player
          <SettingPlayerSelect player={properties.playerX} setPlayer={properties.setPlayerX} />
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
