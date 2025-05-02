// Keep this somewhere in your module scope if you want persistent state:
const userVariables = new Set<string>();

export const parseExpression = (expression: string) => {
  const cleanedExpr = expression.replace(/\s+/g, "");

  // Token regex: number | word | operator/paren/pipe | equal
  const tokenRegex = /(\d*\.\d+|\d+|[a-zA-Z]+|[+\-*/^()=|])/g;
  let rawTokens = cleanedExpr.match(tokenRegex) || [];

  const parsedTokens: string[] = [];

  const mathFunctions = new Set([
    "sin", "cos", "tan", "log", "ln", "sqrt", "abs", 
  ]);

  for (let i = 0; i < rawTokens.length - 1; i++) {
    if (rawTokens[i] === "-" && !isNaN(Number(rawTokens[i + 1]))) {
      rawTokens.splice(i, 2, "-" + rawTokens[i + 1]);
    }
  }
  for (let i = 0; i < rawTokens.length; i++) {
    const curr = rawTokens[i];
    const next = rawTokens[i + 1];

    // Check if current token is an assignment like a =
    if (curr.match(/^[a-zA-Z]+$/) && next === "=") {
      userVariables.add(curr); // store the assigned variable
      parsedTokens.push(curr, "=");
      i++; // skip '=' since we already handled it
      continue;
    }

    parsedTokens.push(curr);

    if (!next) continue;

    // Type checks
    const isNumber = /^\d*\.?\d+$/.test(curr);
    const isAlpha = /^[a-zA-Z]+$/.test(curr);
    const isFunction = isAlpha && mathFunctions.has(curr);
    const isUserVar = isAlpha && userVariables.has(curr);
    const isClosing = curr === ")" || curr === "|";

    const nextIsNumber = /^\d*\.?\d+$/.test(next);
    const nextIsAlpha = /^[a-zA-Z]+$/.test(next);
    const nextIsFunction = nextIsAlpha && mathFunctions.has(next);
    const nextIsUserVar = nextIsAlpha && userVariables.has(next);
    const nextIsOpening = next === "(" || next === "|";

    const isOpening = curr === "(" || curr === "|";

    // Implicit multiplication rules
    if (
      (
        isNumber || isUserVar || isAlpha || isClosing // 2, a, ), sin (sin isAlpha is true, isFunction handled below)
      ) &&
      (
        nextIsNumber || nextIsUserVar || nextIsAlpha || nextIsOpening
      ) &&
      !(isOpening || next === ")" || next === "|")
    ) {
      // Only prevent multiplication if current is a known function
      if (!(isFunction && (nextIsOpening || nextIsAlpha))) {
        parsedTokens.push("*");
      }
  }}

  return parsedTokens;
};