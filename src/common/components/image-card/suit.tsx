import type { JSXElement } from "solid-js";

import type { SuitName } from "./id.ts";

import { arc, bezier, close, line, move, path } from "../../scripts/svg-path.ts";
import { CLUB, DIAMOND, HEART, SPADE } from "./id.ts";

type UseSuitProperties = {
  readonly height?: number | string | undefined;
  readonly suit: SuitName;
  readonly width?: number | string | undefined;
  readonly x?: number | string | undefined;
  readonly y?: number | string | undefined;
};
export const UseSuit = (properties: UseSuitProperties): JSXElement => {
  return <use href={`#${properties.suit}`} {...properties} />;
};

export const SuitSpade = (): JSXElement => {
  return (
    <symbol id={SPADE} viewBox="0 0 60 60">
      <path
        d={path(
          move(15, 60),
          line(45, 60),
          line(33, 47),
          arc(12, 12, 0, 0, 0, 55, 25),
          line(30, 0),
          line(5, 25),
          arc(12, 12, 0, 0, 0, 27, 47),
          close(),
        )}
      />
    </symbol>
  );
};

export const SuitClub = (): JSXElement => {
  return (
    <symbol id={CLUB} viewBox="0 0 60 60">
      <path
        d={path(
          move(15, 60),
          line(45, 60),
          line(33, 47),
          arc(14, 14, 0, 1, 0, 40, 25),
          arc(14, 14, 0, 1, 0, 20, 25),
          arc(14, 14, 0, 1, 0, 27, 47),
          close(),
        )}
      />
    </symbol>
  );
};

export const SuitDiamond = (): JSXElement => {
  return (
    <symbol id={DIAMOND} viewBox="0 0 60 60">
      <path d={path(move(30, 0), line(0, 30), line(30, 60), line(60, 30), close())} />
    </symbol>
  );
};

export const SuitHeart = (): JSXElement => {
  return (
    <symbol id={HEART} viewBox="0 0 60 60">
      <path
        d={path(
          move(30, 60),
          bezier(58, 30, 58, 30, 58, 20),
          arc(12, 12, 0, 0, 0, 30, 20),
          arc(12, 12, 0, 0, 0, 2, 20),
          bezier(2, 30, 2, 30, 30, 60),
          close(),
        )}
      />
    </symbol>
  );
};
