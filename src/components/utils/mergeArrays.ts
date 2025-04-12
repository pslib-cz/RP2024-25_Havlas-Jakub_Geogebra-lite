import { coords } from "../types";

export default function mergeCoords(
  A: coords[][],
  B: coords[][]
): coords[] {
  const combined = [...A, ...B];

  combined.sort((a, b) => a[0].x - b[0].x);

  return combined.flat();
}