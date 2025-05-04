const convertFractions = (expr: string) => {
    const tokens = expr.split(/([\s+\-*/()])/).filter((t) => t.trim() !== "");
  
    const getOperand = (startIndex: number, direction: "left" | "right") => {
      let count = 0;
      let operandTokens: string[] = [];
  
      if (direction === "left") {
        for (let i = startIndex; i >= 0; i--) {
          const token = tokens[i];
          operandTokens.unshift(token);
  
          if (token === ")") count++;
          if (token === "(") count--;
  
          if (count < 0 || (count === 0 && /[+\-*/]/.test(token))) {
            operandTokens.shift(); // remove the operator or extra (
            break;
          }
  
          if (count === 0 && i === 0) break;
        }
      } else {
        for (let i = startIndex; i < tokens.length; i++) {
          const token = tokens[i];
          operandTokens.push(token);
  
          if (token === "(") count++;
          if (token === ")") count--;
  
          if (count < 0 || (count === 0 && /[+\-*/]/.test(token))) {
            operandTokens.pop(); // remove the operator or extra )
            break;
          }
  
          if (count === 0 && i === tokens.length - 1) break;
        }
      }
  
      return operandTokens.join("");
    };
  
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === "/") {
        const left = getOperand(i - 1, "left");
        const right = getOperand(i + 1, "right");
  
        if (left && right) {
          tokens.splice(
            i - left.split(/([\s+\-*/()])/).filter(t => t.trim() !== "").length,
            1 + left.split(/([\s+\-*/()])/).filter(t => t.trim() !== "").length + right.split(/([\s+\-*/()])/).filter(t => t.trim() !== "").length,
            `\\frac{${left}}{${right}}`
          );
          i--; // adjust loop after splice
        }
      }
    }
  
    return tokens.join("");
  };


  export default convertFractions;