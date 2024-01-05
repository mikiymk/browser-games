import { createSignal } from "solid-js";
import type { JSXElement } from "solid-js";

type SettingModalProperties = {
  readonly children: JSXElement;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const SettingModal = (properties: SettingModalProperties): JSXElement => {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        open settings
      </button>
      <dialog open={open()}>
        <h3>Settings</h3>

        {properties.children}

        <button type="button" onClick={() => setOpen(false)}>
          close settings
        </button>
      </dialog>
    </>
  );
};
