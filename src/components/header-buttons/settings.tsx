import { HeaderPopup } from "@/components/page-header/header-popup";
import { TEXT_SETTINGS } from "@/scripts/constants";
import type { JSXElement } from "solid-js";

type SettingsProperties = {
  readonly children: JSXElement;
};
export const Settings = (properties: SettingsProperties): JSXElement => {
  return (
    <HeaderPopup icon="settings" label={TEXT_SETTINGS}>
      <h2>{TEXT_SETTINGS}</h2>

      <dl class="grid grid-cols-2">{properties.children}</dl>
    </HeaderPopup>
  );
};

type SettingItemProperties = {
  readonly label: string;
  readonly input: JSXElement;
};
export const SettingItem = (properties: SettingItemProperties): JSXElement => {
  return (
    <>
      <dt>{properties.label}</dt>
      <dd>{properties.input}</dd>
    </>
  );
};
