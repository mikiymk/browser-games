import type { JSXElement } from "solid-js";

type LinkGoogleFontsProperties = {
  readonly fonts: readonly string[];
  readonly text?: string | undefined;
};

export const LinkGoogleFonts = (properties: LinkGoogleFontsProperties): JSXElement => {
  const href = (): string => {
    const urlBase = "https://fonts.googleapis.com/css2?display=swap";
    const fonts = properties.fonts.map((font) => `&family=${font.replaceAll(" ", "+")}`);
    const text = encodeURIComponent([...new Set(properties.text ?? "")].toSorted().join(""));

    return `${urlBase}${fonts.join("")}${text !== "" ? `&text=${text}` : ""}`;
  };

  return <link href={href()} rel="stylesheet" />;
};
