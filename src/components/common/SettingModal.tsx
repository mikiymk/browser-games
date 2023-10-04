import { createSignal, type JSXElement } from "solid-js";

type SettingModalProperties = {
  children: JSXElement;
};

export const SettingModal = (properties: SettingModalProperties) => {
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
