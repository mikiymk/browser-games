import type { JSXElement } from "solid-js";

import icon from "../../../images/theme-icon.svg";

type HeadPropeties = {
  readonly canonicalUrl: string;
  readonly title: string | undefined;
};
export const Head = (properties: HeadPropeties): JSXElement => {
  const titleText = (): string =>
    properties.title !== undefined ? `${properties.title} | Board Games` : "Board Games";

  return (
    <>
      <meta charset="utf8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <link href={icon.src} rel="shortcut icon" type="image/svg+xml" />
      <link href={properties.canonicalUrl} rel="canonical" />
      <link href="https://cdn.jsdelivr.net/npm/destyle.css@latest/destyle.min.css" rel="stylesheet" />
      <title>{titleText()}</title>
    </>
  );
};
