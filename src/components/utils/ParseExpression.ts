
export const parseExpression = (expression: string) => {
  const cleanedExpr = expression.replace(/\s+/g, "");

  const tokenRegex = /(\d*\.\d+|\d+|[a-zA-Z]+|[+\-*/^()|])/g;
  let rawTokens = cleanedExpr.match(tokenRegex) || [];

  const parsedTokens: string[] = [];

  // List of recognized math functions
  const mathFunctions = new Set([
    "sin", "cos", "tan", "log", "ln", "sqrt", "abs", "asin", "acos", "atan", "exp"
  ]);

  for (let i = 0; i < rawTokens.length; i++) {
    const curr = rawTokens[i];
    const next = rawTokens[i + 1];

    parsedTokens.push(curr);

    if (!next) continue;

    const isNumber = /^\d*\.?\d+$/.test(curr);
    const isAlpha = /^[a-zA-Z]+$/.test(curr);
    const isFunction = isAlpha && mathFunctions.has(curr);
    const isClosing = curr === ")" || curr === "|";

    const nextIsAlpha = /^[a-zA-Z]+$/.test(next);
    const nextIsOpening = next === "(" || next === "|";
    const nextIsNumber = /^\d*\.?\d+$/.test(next);

    const isOpening = curr === "(" || curr === "|";

    // Only insert '*' for implicit multiplication when it makes sense
    if (
      (isNumber || (isAlpha && !isFunction) || isClosing) &&
      (nextIsAlpha || nextIsOpening || nextIsNumber) &&
      !(isOpening || next === ")" || next === "|")
    ) {
      parsedTokens.push("*");
    }
  }

  return parsedTokens;
};

