import { createReference } from "./reference";

import type { JSXElement } from "solid-js";

type SettingModalProperties = {
  children: JSXElement;
};
export const SettingModal = (properties: SettingModalProperties) => {
  const dialog = createReference<HTMLDialogElement>();

  const openSettings = () => {
    dialog.value?.showModal();
  };

  const closeSettings = () => {
    dialog.value?.close();
  };

  return (
    <>
      <button type="button" onClick={openSettings}>
        open settings
      </button>
      <dialog ref={dialog.setValue}>
        <h3>Settings</h3>

        {properties.children}

        <button type="button" onClick={closeSettings}>
          close settings
        </button>
      </dialog>
    </>
  );
};
