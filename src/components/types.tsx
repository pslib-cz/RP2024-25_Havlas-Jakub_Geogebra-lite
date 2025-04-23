export type FunctionData = {
  id: number;
  color: string;
  expression: string[];
  pathArray: coords[][];
};

export type ViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type coords = {
  x: number;
  y: number;
};

export type reqs = {
  expression: string;
  color: string;
};
