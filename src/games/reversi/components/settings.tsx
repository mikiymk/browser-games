import checkedBox from "@/images/symbol/checkbox-checked.svg";
import uncheckedBox from "@/images/symbol/checkbox.svg";
import { h2Style } from "@/styles/common.css";
import { disableStyle, settingCheckBoxStyle, settingItemStyle } from"@/games/reversi/style.css";
import { Show } from "solid-js";
import type { JSXElement, Setter } from "solid-js";
import { StyledSvg } from "@/components/common/styled-svg";

type SettingsProperties = {
  readonly playing: boolean;

  readonly enableWatch: boolean;
  readonly setEnableWatch: Setter<boolean>;
};

export const Settings = (properties: SettingsProperties): JSXElement => {
  return (
    <div>
      <h2 class={h2Style}>Settings</h2>

      <dl>
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
