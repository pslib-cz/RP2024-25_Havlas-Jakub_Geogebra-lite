
export const parseExpression = (expression: string) => {
  const cleanedExpr = expression.replace(/\s+/g, "");

  // Match numbers, operators, parentheses, and individual letters or function names
  const tokenRegex = /(\d*\.\d+|\d+|[a-zA-Z]+|[+\-*/^()|])/g;
  let rawTokens = cleanedExpr.match(tokenRegex) || [];

  const parsedTokens: string[] = [];

  for (let i = 0; i < rawTokens.length; i++) {
    const curr = rawTokens[i];
    const next = rawTokens[i + 1];

    parsedTokens.push(curr);

    if (!next) continue;

    const isNumber = /^\d*\.?\d+$/.test(curr);
    const isAlpha = /^[a-zA-Z]+$/.test(curr);
    const isClosing = curr === ")" || curr === "|";

    const nextIsAlpha = /^[a-zA-Z]+$/.test(next);
    const nextIsOpening = next === "(" || next === "|";
    const nextIsNumber = /^\d*\.?\d+$/.test(next);

    // Insert "*" between:
    // number/function/variable/closing → opening/function/variable/number
    if (
      (isNumber || isAlpha || isClosing) &&
      (nextIsAlpha || nextIsOpening || nextIsNumber)
    ) {
      parsedTokens.push("*");
    }
  }

  return parsedTokens;
};

