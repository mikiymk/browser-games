import checkedBox from "@/images/symbol/checkbox-checked.svg";
import uncheckedBox from "@/images/symbol/checkbox.svg";
import { h2Style } from "@/styles/common.css";
import { disableStyle, settingCheckBoxStyle, settingItemStyle } from "@/styles/reversi.css";
import { Show } from "solid-js";
import type { JSXElement, Setter } from "solid-js";
import { LabeledRadioInput } from "../common/labeled-radio/labeled-radio";
import { StyledSvg } from "../common/styled-svg";
import { AiPlayer, HumanPlayer } from "./const";

type SettingsProperties = {
  readonly playing: boolean;

  readonly black: number;
  readonly setBlack: Setter<number>;
  readonly white: number;
  readonly setWhite: Setter<number>;

  readonly enableWatch: boolean;
  readonly setEnableWatch: Setter<boolean>;
};

export const Settings = (properties: SettingsProperties): JSXElement => {
  return (
    <div>
      <h2 class={h2Style}>Settings</h2>

      <dl>
        <dt>Black Player</dt>
        <dd class={settingItemStyle}>
          <LabeledRadioInput
            label="Player"
            checked={properties.black === HumanPlayer}
            enable={!properties.playing}
            check={() => {
              properties.setBlack(HumanPlayer);
            }}
          />
          <LabeledRadioInput
            label="CPU"
            checked={properties.black === AiPlayer}
            enable={!properties.playing}
            check={() => {
              properties.setBlack(AiPlayer);
            }}
          />
        </dd>

        <dt>White Player</dt>
        <dd class={settingItemStyle}>
          <LabeledRadioInput
            label="Player"
            checked={properties.white === HumanPlayer}
            enable={!properties.playing}
            check={() => {
              properties.setWhite(HumanPlayer);
            }}
          />
          <LabeledRadioInput
            label="CPU"
            checked={properties.white === AiPlayer}
            enable={!properties.playing}
            check={() => {
              properties.setWhite(AiPlayer);
            }}
          />
        </dd>

        <dt>Game Clock</dt>
        <dd class={settingItemStyle}>
          <label class={properties.playing ? disableStyle : ""}>
            <input
              type="checkbox"
              disabled={properties.playing}
              onClick={() => {
                properties.setEnableWatch((previous) => !previous);
              }}
            />
            <Show
              when={properties.enableWatch}
              fallback={<StyledSvg class={settingCheckBoxStyle} src={uncheckedBox.src} alt="disable" />}
            >
              <StyledSvg class={settingCheckBoxStyle} src={checkedBox.src} alt="enable" />
            </Show>
            use game clock
          </label>
        </dd>
      </dl>
    </div>
  );
};
