export const evaluator = (expression: string[], x: number) => {
  //expression = insertImplicitMultiplication(expression);
  expression = expression.map((item) => {
    if (item === "x") return x.toString();

    const constant = constants.find((c) => c.symbol === item.toLowerCase());
    if (constant) return constant.value.toString();

    return item.toString();
  });

let foundParen = true;

//ai
// Could you make the code handle brackets and absolute brackets as well? use recursion for this.
while (foundParen) {
  foundParen = false;
  let i = 0;

  while (i < expression.length) {
    if (expression[i] === "(") {
      const openIndex = i;
      let depth = 1;

      for (let j = i + 1; j < expression.length; j++) {
        if (expression[j] === "(") depth++;
        if (expression[j] === ")") depth--;

        if (depth === 0) {
          const subExpr = expression.slice(openIndex + 1, j);
          let result = evaluator(subExpr, x);

          // Just grouping — no function applied
          expression.splice(openIndex, j - openIndex + 1, result.toString());
          i = openIndex;
          foundParen = true;
          break;
        }
      }
    }
    i++;
  }
}


let foundAbs = true;

while (foundAbs) {
  foundAbs = false;
  let i = 0;

  while (i < expression.length) {
    if (expression[i] === "|") {
      const openIndex = i;
      let depth = 1;

      for (let j = i + 1; j < expression.length; j++) {
        if (expression[j] === "|") {
          depth--;
          if (depth === 0) {
            const subExpr = expression.slice(openIndex + 1, j);
            let result = evaluator(subExpr, x);

            result = Math.abs(parseFloat(result)).toString();

            expression.splice(openIndex, j - openIndex + 1, result);
            i = openIndex;
            foundAbs = true;
            break;
          }
        }
      }
    }
    i++;
  }
}

    for (const { symbol, fn } of functions) {
      for (let i = expression.length - 1; i >= 0; i--) {
        if (expression[i] === symbol) {
          const right = parseFloat(expression[i + 1]);
  
          if (!isNaN(right)) {
            const result = fn(right);
  
            expression[i] = result.toString();
  
            expression.splice(i + 1, 1); // remove operator and right operand
          } else {
            throw new Error(`Invalid operands for '${symbol}'`);
          }
        }
      }
    }
  

    //ai
    // How does math evamluators work?
    for (const { symbol, fn } of OPERATORS) {
      for (let i = expression.length - 1; i >= 0; i--) {
        if (expression[i] === symbol) {
          const left = parseFloat(expression[i - 1]);
          const right = parseFloat(expression[i + 1]);
  
          if (!isNaN(left) && !isNaN(right)) {
            const result = fn(left, right);
            expression[i - 1] = result.toString();
            expression.splice(i, 2); // remove operator and right operand
          }
        }
      }
    }
  
    return expression[0];
  };

  const OPERATORS = [
    { symbol: "^", fn: (a: number, b: number) => Math.pow(a, b) },
    { symbol: "*", fn: (a: number, b: number) => a * b },
    { symbol: "/", fn: (a: number, b: number) => a / b },
    { symbol: "+", fn: (a: number, b: number) => a + b },
    { symbol: "-", fn: (a: number, b: number) => a - b },
  ];
  
  const functions = [
    { symbol: "sin", fn: (a: number) => Math.sin(a) },
    { symbol: "cos", fn: (a: number) => Math.cos(a) },
    { symbol: "tan", fn: (a: number) => Math.tan(a) },
    { symbol: "log", fn: (a: number) => Math.log10(a) },
    { symbol: "cotan", fn: (a: number) => 1/Math.tan(a) },
    { symbol: "sqrt", fn: (a: number) => Math.sqrt(a) },
  ];
  const constants = [
    { symbol: "pi", value: Math.PI },
    { symbol: "e", value: Math.E },
    { symbol: "phi", value: (1 + Math.sqrt(5)) / 2 },
    { symbol: "tau", value: 2 * Math.PI },
    { symbol: "gamma", value: 0.5772156649 },
    { symbol: "catalan", value: 0.9159655941 },
    { symbol: "apery", value: 1.2020569032 },
    { symbol: "eulerMascheroni", value: 0.5772156649 },
    { symbol: "goldenRatioConjugate", value: (Math.sqrt(5) - 1) / 2 },
  ];
  
  const brackets = [
    { symbol: ["(", ")"], fn: (a: number) => a },
    { symbol: ["|", "|"], fn: (a: number) => Math.abs(a) },
  ];

  const variables = [
    { symbol: "x", value: 0 },
    { symbol: "y", value: 0 },
    { symbol: "z", value: 0 },
  ];

  const insertImplicitMultiplication = (tokens: string[]): string[] => {
    const result: string[] = [];
  
    for (let i = 0; i < tokens.length; i++) {
      result.push(tokens[i]);
  
      const curr = tokens[i];
      const next = tokens[i + 1];
  
      if (!next) continue;
  
      const isNumber = (s: string) => !isNaN(parseFloat(s));
      const isVariableOrFunc = (s: string) =>
        s === "x" || constants.some(c => c.symbol === s) || functions.some(f => f.symbol === s);
  
      const isOpenBracket = next === "(" || next === "|";
  
      // If current token is a number, variable, constant or closing bracket
      // and next is a variable, function, or opening bracket => insert *
      if (
        (isNumber(curr) || curr === "x" || curr === ")" || curr === "|" || constants.some(c => c.symbol === curr)) &&
        (isVariableOrFunc(next) || isOpenBracket)
      ) {
        result.push("*");
      }
    }
  
    return result;
  };