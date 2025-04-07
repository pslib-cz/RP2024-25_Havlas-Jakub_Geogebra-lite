import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  let rovnice = "y = ax + b";
  let rovnice2 = "y = 1x + 5";

  const handleMouseMove = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    const svg = event.currentTarget;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformedPoint = point.matrixTransform(
      svg.getScreenCTM()?.inverse()
    );
    setMousePosition({
      x: parseFloat(transformedPoint.x.toFixed(2)),
      y: parseFloat(transformedPoint.y.toFixed(2)),
    });
  };

  return (
    <>
      <svg
        width="1000"
        height="1000"
        viewBox="-15 -15 30 30"
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={handleMouseMove}
      >
        <rect x="-15" y="-15" width="30" height="30" fill="white" />

        <g stroke="lightgray" stroke-width="0.1">
          <line x1="-15" y1="0" x2="15" y2="0" stroke="black" />
          <line y1="-15" y2="15" x1="0" x2="0" stroke="black" />
        </g>
        <General expression={rovnice} />

        <g stroke-width="0.1" stroke="lightgray">
          <line x1="-10" y1="-15" x2="-10" y2="15" />
          <line x1="-5" y1="-15" x2="-5" y2="15" />

          <line x1="5" y1="-15" x2="5" y2="15" />
          <line x1="10" y1="-15" x2="10" y2="15" />
        </g>

        <g stroke-width="0.1" stroke="lightgray">
          <line y1="-10" x1="-15" y2="-10" x2="15" />
          <line y1="-5" x1="-15" y2="-5" x2="15" />

          <line y1="5" x1="-15" y2="5" x2="15" />
          <line y1="10" x1="-15" y2="10" x2="15" />
        </g>

        <g
          font-family="Arial"
          font-size="0.5"
          fill="black"
          text-anchor="middle"
        >
          <text x="-10" y="-0.5">
            -10
          </text>
          <text x="-5" y="-0.5">
            -5
          </text>
          <text x="5" y="-0.5">
            5
          </text>
          <text x="10" y="-0.5">
            10
          </text>

          <text x="0.5" y="-10">
            10
          </text>
          <text x="0.5" y="-5">
            5
          </text>
          <text x="0.5" y="5">
            -5
          </text>
          <text x="0.5" y="10">
            -10
          </text>
        </g>

        <text
          x={mousePosition.x}
          y={mousePosition.y}
          fontSize="0.5"
          fill="black"
        >
          {`(${mousePosition.x}, ${mousePosition.y})`}
        </text>
      </svg>
    </>
  );
}

export default App;

let LineLinear = ({ expression }: { expression: string }) => {
  let a = parseFloat(expression.split("x")[0].trim().charAt(4));
  let b = parseFloat(expression.split("+")[1].trim());

  return (
    <line
      x1="-500"
      y1={500 * a - b}
      x2="500"
      y2={-500 * a + b}
      stroke="red"
      stroke-width="0.1"
    />
  );
};

let ParaBole = ({ expression }: { expression: string }) => {
  // y = ax^2 + bx + c
  let a = 1;
  let b = 0;
  let c = 0;
  let x = -500 / 33;
  let y = a * x * x + b * x + c;
  let path = `M ${x} ${-y} `;
  for (let i = -499; i < 500; i++) {
    let x = i / 33;
    let y = a * x * x + b * x + c;
    path = path + `L ${x} ${-y} `;
  }

  return (
    <path d={`M 0 0 ${path}`} fill="none" stroke="blue" stroke-width="0.1" />
  );
};
let LinearPolygonal = ({ expression }: { expression: string }) => {
  // y = (ax + b) / (cx + d)
  let a = 2;
  let b = 3;
  let c = 1;
  let d = 1;
  let AsymptotaX = -d / c;
  let AsypmtotaY = a / c;

  let path;
  let path2;
  for (let i = -15; i < AsymptotaX; i = i + 1 / 33) {
    let x = i;
    let y = (a * x + b) / (c * x + d);
    if (i === -15) {
      path = `M ${x} ${-y} `;
    } else {
      path = path + `L ${x} ${-y} `;
    }
  }
  for (let i = AsymptotaX + 1 / 33; i < 15; i = i + 1 / 33) {
    let x = i;
    let y = (a * x + b) / (c * x + d);
    if (i === AsymptotaX + 1 / 33) {
      path2 = `M ${x} ${-y} `;
    } else {
      path2 = path2 + `L ${x} ${-y} `;
    }
  }

  return (
    <>
      <path d={path} fill="none" stroke="green" stroke-width="0.1" />
      <path d={path2} fill="none" stroke="green" stroke-width="0.1" />
    </>
  );
};

let Sinusoid = ({ expression }: { expression: string }) => {
  // y = a * sin(b * x + c) + d
  let a = 1;
  let b = 1;
  let c = 0;
  let d = 0;
  let path;
  for (let i = -15; i < 15; i = i + 1 / 33) {
    let x = i;
    let y = a * Math.sin(b * x + c) + d;
    if (i === -15) {
      path = `M ${x} ${-y} `;
    } else {
      path = path + `L ${x} ${-y} `;
    }
  }

  return <path d={path} fill="none" stroke="pink" stroke-width="0.1" />;
};

let Cosinusoid = ({ expression }: { expression: string }) => {
  // y = a * sin(b * x + c) + d
  let a = 1;
  let b = 1;
  let c = 0;
  let path;
  for (let i = -15; i < 15; i = i + 1 / 33) {
    let x = i;
    let y = a * Math.cos(b * x) + c;
    if (i === -15) {
      path = `M ${x} ${-y} `;
    } else {
      path = path + `L ${x} ${-y} `;
    }
  }

  return <path d={path} fill="none" stroke="yellow" stroke-width="0.1" />;
};

let Tangensoid = ({ expression }: { expression: string }) => {
  // y = a * sin(b * x + c) + d
  let a = 1;
  let b = 1;
  let c = 0;
  let pathArray: string[] = [];
  let path;
  let lock = true;
  let lastY = -Infinity;
  let j = 0;
  for (let i = -15; i < 15; i = i + 1 / 33) {
    let x = i;
    let y = a * Math.tan(b * x) + c;

    if (lastY > y) {
      lastY = -Infinity;
      j++;
      lock = true;
      continue;
    } else {
      lastY = y;
    }
    if (lock) {
      pathArray[j] = `M ${x} ${-y} `;
      lock = false;
    } else {
      pathArray[j] = pathArray[j] + `L ${x} ${-y} `;
    }
  }

  return (
    <>
      {pathArray.map((d, index) => (
        <path key={index} d={d} stroke="black" fill="none" strokeWidth={0.1} />
      ))}
    </>
  );
};
let CoTangensoid = ({ expression }: { expression: string }) => {
  // y = a * sin(b * x + c) + d
  let a = 1;
  let b = 1;
  let c = 0;
  let pathArray: string[] = [];

  let lock = true;
  let lastY = Infinity;
  let j = 0;
  for (let i = -15; i < 15; i = i + 1 / 33) {
    let x = i;
    let y = a * (1 / Math.tan(b * x)) + c;

    if (lastY < y) {
      lastY = Infinity;
      j++;
      lock = true;
      continue;
    } else {
      lastY = y;
    }
    if (lock) {
      pathArray[j] = `M ${x} ${-y} `;
      lock = false;
    } else {
      pathArray[j] = pathArray[j] + `L ${x} ${-y} `;
    }
  }

  return (
    <>
      {pathArray.map((d, index) => (
        <path key={index} d={d} stroke="orange" fill="none" strokeWidth={0.1} />
      ))}
    </>
  );
};

let Exponential = ({ expression }: { expression: string }) => {
  let a = 1;
  let b = 1;
  let c = 0;

  let path;
  for (let i = -15; i < 15; i = i + 1 / 33) {
    let x = i;

    let y = a * Math.exp(b * x) + c;

    if (i === -15) {
      path = `M ${x} ${-y} `;
    } else {
      path = path + `L ${x} ${-y} `;
    }
  }

  return <path d={path} fill="none" stroke="purple" stroke-width="0.1" />;
};

let Logarythmic = ({ expression }: { expression: string }) => {
  let a = 2;
  let b = 3;
  let c = 2;
  let path;
  for (let i = 0 + 1 / 33; i < 15; i = i + 1 / 33) {
    let x = i;
    let ans = Math.log10(x * b);

    let y = a * ans + c;
    console.log(ans);
    console.log(x, y);
    if (i === 0 + 1 / 33) {
      path = `M ${x} ${-y} `;
    } else {
      path = path + `L ${x} ${-y} `;
    }
  }

  return <path d={path} fill="none" stroke="crimson" stroke-width="0.1" />;
};

let Polynomial = ({ expression }: { expression: string }) => {
  // y = ax^n + bx^(n-1) + cx^(n-2) + ... + d
  let a = 2;
  let b = 6;
  let c = 4;
  let n = 3;
  let path;
  for (let i = -15; i < 15; i = i + 1 / 33) {
    let x = i;
    let y =
      a * Math.pow(x, n) + b * Math.pow(x, n - 1) + c * Math.pow(x, n - 2);
    if (i === -15) {
      path = `M ${x} ${-y} `;
    } else {
      path = path + `L ${x} ${-y} `;
    }
  }

  return <path d={path} fill="none" stroke="purple" stroke-width="0.1" />;
};
let General = ({ expression }: { expression: string }) => {
  let expression2 = "5*log(2*x) + 3"; // Example expression
  let str = expression2; // Define 'str' as the input expression
  let result = parseExpression(str); // Parse the expression

  let pathArray: string[] = [];

  let lock = true;
  let lastY = 1000;
  let j = 0;
  for (let i = -15; i < 15; i = i + 1 / 100) {
    let x = i;
    let y = parseFloat(evaluator(result, i));
    if (isNaN(y)) {
      continue; // Skip if the result is NaN (e.g., division by zero)
    }
    if (y > 20) {
      y = 16;
    }
    if (y < -20) {
      y = -16;
    }
   
    if (Math.abs(lastY) > 15 && Math.abs(y) > 15 && lastY * y < 0) {
      lastY = 100;
      j++;
      lock = true;
      continue;
    } else {
      lastY = y;
    }

    if (lock) {
      pathArray[j] = `M ${Math.round(x * 1000) / 1000} ${
        Math.round(-y * 1000) / 1000
      } `;
      lock = false;
    } else {
      pathArray[j] =
        pathArray[j] +
        `L ${Math.round(x * 1000) / 1000} ${Math.round(-y * 1000) / 1000} `;
    }
  }

  return (
    <>
      {pathArray.map((d, index) => (
        <path key={index} d={d} stroke="black" fill="none" strokeWidth={0.1} />
      ))}
    </>
  );
};

const parseExpression = (expression: string) => {
  // Remove spaces
  const cleanedExpr = expression.replace(/\s+/g, "");

  // Regex to match function names, numbers, operators, and parentheses
  const tokenRegex = /([a-zA-Z]+)|(\d*\.\d+|\d+)|([+\-*/^()])/g;
  const rawTokens = cleanedExpr.match(tokenRegex) || [];

  // Process tokens: numbers as float, functions/operators as strings
  const parsedTokens = rawTokens.map(token => {
    if (/^\d*\.?\d+$/.test(token)) {
      return token;
    }
    return token;
  });

  return parsedTokens;
};

let evaluator = (expression: string[], x: number) => {
  expression = expression.map((item) =>
    item === "x" ? x.toString() : item.toString()
  );

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === "(") {
      let openIndex = i;
      let depth = 1;

      for (let j = i + 1; j < expression.length; j++) {
        if (expression[j] === "(") depth++;
        if (expression[j] === ")") depth--;

        if (depth === 0) {
          const subExpr = expression.slice(openIndex + 1, j);
          const result = evaluator(subExpr, x); // RECURSIVE!
          expression.splice(openIndex, j - openIndex + 1, result); // replace ( ... ) with result
          i = openIndex - 1; // rewind to recheck
          break;
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
  { symbol: "goldenRatioConjugate", value: (Math.sqrt(5) - 1) / 2 },]

  const brackets = [
    { symbol: "(", fn: (a: number) => a },
    { symbol: "|", fn: (a: number) => Math.abs(a) },
  ]