import type { JSXElement } from "solid-js";
import { line, move, path } from "../../../common/scripts/svg-path.ts";
import type { Path } from "../../../common/scripts/svg-path.ts";
import { separator } from "./style.css.ts";

type FieldSeparationProperties = {
  readonly height: number;
  readonly width: number;
};
export const SquareSeparation = (properties: FieldSeparationProperties): JSXElement => {
  return <path class={separator} d={separation(properties.height, properties.width)} />;
};

const separation = (height: number, width: number): string => {
  const pathObjects: Path[] = [];
  for (let x = 0; x <= width; x++) {
    pathObjects.push(move(0, x * 10), line(height * 10, x * 10));
  }
  for (let y = 0; y <= height; y++) {
    pathObjects.push(move(y * 10, 0), line(y * 10, width * 10));
  }

  return path(...pathObjects);
};
