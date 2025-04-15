
export const parseExpression = (expression: string) => {
  const cleanedExpr = expression.replace(/\s+/g, "");

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

    // Don't insert "*" between opening brackets and what's inside
    const isOpening = curr === "(" || curr === "|";

    // Only insert "*" if not both sides are opening symbols
    if (
      (isNumber || isAlpha || isClosing) &&
      (nextIsAlpha || nextIsOpening || nextIsNumber) &&
      !(isOpening || next === ")" || next === "|")
    ) {
      parsedTokens.push("*");
    }
  }

  return parsedTokens;
};

