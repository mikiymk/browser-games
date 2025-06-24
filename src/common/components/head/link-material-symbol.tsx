import type { JSXElement } from "solid-js";

type LinkMaterialSymbolProperties = {
  readonly icons: readonly string[];
};

export const LinkMaterialSymbol = (properties: LinkMaterialSymbolProperties): JSXElement => {
  const href = (): string => {
    const urlBase = "https://fonts.googleapis.com/css2?display=swap&family=Material+Symbols+Rounded&icon_names=";
    const icons = properties.icons.toSorted().join(",");

    return `${urlBase}${icons}`;
  };

  return <link href={href()} rel="stylesheet" />;
};
