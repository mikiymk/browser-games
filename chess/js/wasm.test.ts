import { expect, test } from "vitest";
import { add } from "../wasm/pkg/chess_wasm";

test("wasm test", () => {
  const result = add(2, 3);

  expect(result).toBe(5);
});
