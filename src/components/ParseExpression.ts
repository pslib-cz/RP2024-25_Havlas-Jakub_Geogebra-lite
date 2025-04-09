
export const parseExpression = (expression: string) => {
    // Remove spaces
    const cleanedExpr = expression.replace(/\s+/g, "");
  
    // Regex to match function names, numbers, operators, and parentheses
    const tokenRegex = /([a-zA-Z]+)|(\d*\.\d+|\d+)|([+\-*/^()|])/g;
    const rawTokens = cleanedExpr.match(tokenRegex) || [];
  
    // Process tokens: numbers as float, functions/operators as strings
    const parsedTokens = rawTokens.map((token) => {
      if (/^\d*\.?\d+$/.test(token)) {
        return token;
      }
      return token;
    });
  
    return parsedTokens;
  };

