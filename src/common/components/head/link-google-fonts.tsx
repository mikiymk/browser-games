import type { JSXElement } from "solid-js";

type LinkGoogleFontsProperties = {
  readonly fonts: readonly string[];
  readonly text?: string | undefined;
};

export const LinkGoogleFonts = (properties: LinkGoogleFontsProperties): JSXElement => {
  const href = (): string => {
    return (
      "https://fonts.googleapis.com/css2?display=swap" +
      properties.fonts.map((font) => `&family=${font.replaceAll(" ", "+")}`).join("") +
      (properties.text !== undefined ? `&text=${encodeURIComponent(properties.text)}` : "")
    );
  };

  return <link href={href()} rel="stylesheet" />;
};
