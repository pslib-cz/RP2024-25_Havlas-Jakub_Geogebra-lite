

//ai 
//Could you make me a function that would take a string expression and parse it into an array of tokens? The function should handle numbers, operators and funtions. It should also handle implicit multiplication (e.g., "2x" should be parsed as "2*x"). The function should return an array of strings representing the tokens. For example, the input "3 + 4 * (2 - 1)" should return ["3", "+", "4", "*", "(", "2", "-", "1", ")"].
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

