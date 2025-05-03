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

export const ValidFunctions: string[] = [
  "sin",
  "cos",
  "tan",
  "log",
  "cotan",
  "ln",
  "abs",
  "exp",
  "sqrt",
  "log2",
  "log10",
]
export const ValidOperators: string[] = [
  "+",
  "-",
  "*",
  "/",
  "^",
]
export const ValidConstants: string[] = [
  "π",
  "e",
]

export const ValidBrackets: string[] = [
  "(",
  ")",
  "|",
]
export const ValidVariables: string[] = [
 

  "z",
  "a",
  "b",
  "c",
  "d",

  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",

]


