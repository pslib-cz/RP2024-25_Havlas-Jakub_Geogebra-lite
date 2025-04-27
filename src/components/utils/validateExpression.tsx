const mathFunctions = new Set([
    "sin", "cos", "tan", "log", "ln", "sqrt", "abs", "asin", "acos", "atan", "exp"
  ]);
  
  const constants = new Set(["pi", "e"]);
  const allowedVariable = "x";
  const allowedChars = /^[0-9+\-*/^().a-zA-Z\s]*$/;
  
  export function validateAndCleanExpression(
    input: string,
    evaluator?: (expr: string) => any
  ): { valid: boolean; message: string; cleaned?: string } {
    let expr = input.replace(/\s+/g, "");
  
    if (!allowedChars.test(expr)) {
      return { valid: false, message: "Expression contains invalid characters." };
    }
  
    // Check balanced parentheses
    let balance = 0;
    for (let char of expr) {
      if (char === "(") balance++;
      else if (char === ")") balance--;
      if (balance < 0) {
        return { valid: false, message: "Unbalanced parentheses." };
      }
    }
    if (balance !== 0) {
      return { valid: false, message: "Unbalanced parentheses." };
    }
  
    // Insert explicit multiplication
    expr = expr.replace(/(\d)([a-zA-Z(])/g, "$1*$2");       // 2x, 3sin(x) → 2*x, 3*sin(x)
    expr = expr.replace(/([a-zA-Z])(\d|\()/g, "$1*$2");     // x2, x( → x*2, x*(
  
    // Validate tokens
    const tokenPattern = /[a-zA-Z]+/g;
    const matches = expr.match(tokenPattern) || [];
    for (const token of matches) {
      if (token === allowedVariable) continue;
      if (constants.has(token)) continue;
      if (mathFunctions.has(token)) continue;
      return { valid: false, message: `Invalid token: ${token}` };
    }
  
    // Optional: dry run with user's evaluator
    if (evaluator) {
      try {
        evaluator(expr); // Use dummy value for x inside evaluator
      } catch (e) {
        return { valid: false, message: `Evaluation failed: ${(e as Error).message}` };
      }
    }
  
    return { valid: true, message: "Expression is valid.", cleaned: expr };
  }
  