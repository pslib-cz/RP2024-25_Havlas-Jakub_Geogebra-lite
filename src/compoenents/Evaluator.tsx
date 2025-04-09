let evaluator = (expression: string[], x: number) => {
    expression = expression.map((item) =>
      item === "x" ? x.toString() : item.toString()
    );
  
    for (const { symbol, fn } of brackets) {
      for (let i = 0; i < expression.length; i++) {
        if (expression[i] === symbol[0]) {
          let openIndex = i;
          let depth = 1;
  
          if (symbol[0] === "|") {
            // Special handling for absolute value bars
            let openIndex = i;
            for (let j = i + 1; j < expression.length; j++) {
              if (expression[j] === "|") {
                const subExpr = expression.slice(openIndex + 1, j);
                let result = evaluator(subExpr, x);
                result = Math.abs(parseFloat(result)).toString();
                expression.splice(openIndex, j - openIndex + 1, result);
                i = openIndex - 1;
                break;
              }
            }
          }
          for (let j = i + 1; j < expression.length; j++) {
            if (expression[j] === symbol[0]) depth++;
            if (expression[j] === symbol[1]) depth--;
  
            if (depth === 0) {
              const subExpr = expression.slice(openIndex + 1, j);
              let result = evaluator(subExpr, x);
  
              expression.splice(openIndex, j - openIndex + 1, result); // replace ( ... ) with result
              i = openIndex - 1; // rewind to recheck
              break;
            }
          }
        }
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