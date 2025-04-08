import React, { useState, useCallback, useRef, useEffect } from "react";

import "./App.css";

function App() {
  const [viewBox, setViewBox] = useState({
    x: -15,
    y: -15,
    width: 30,
    height: 30,
  });
  const svgRef = useRef<SVGSVGElement | null>(null);
  let rovnice = "(2*x + 1) / (x - 1)";
  const handleWheel = (e: WheelEvent) => {
    
    e.preventDefault();

    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    
    setViewBox((prev) => {
      const centerX = prev.x + prev.width / 2;
      const centerY = prev.y + prev.height / 2;

      const newWidth = prev.width * zoomFactor;
      const newHeight = prev.height * zoomFactor;

      return {
        width: newWidth,
        height: newHeight,
        x: centerX - newWidth / 2,
        y: centerY - newHeight / 2,
      };
    });
  };
  useEffect(() => {
   
  }, [viewBox]);
  useEffect(() => {
    const svg = svgRef.current;
   
  
    if (!svg) return;
  
    svg.addEventListener('wheel', handleWheel, { passive: false });
  
    return () => {
      svg.removeEventListener('wheel', handleWheel);
    };
  }, []);
  
  

  return (
    
    <>
   <div 
 
   // Removed as handleMouseMove is specific to SVG elements
     
   

        >
          <svg
          ref={svgRef}
        width="1000"
        height="1000"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        style={{ width: '100%', height: 'auto' ,
        border: '1px solid black'
         
          
        }}
       
        
       
      >
        <rect x="-15" y="-15" width="30" height="30" fill="white" />

        <g stroke="lightgray" stroke-width="0.1">
          <line x1="-15" y1="0" x2="15" y2="0" stroke="black" />
          <line y1="-15" y2="15" x1="0" x2="0" stroke="black" />
        </g>
        <General expression={rovnice} viewBox={viewBox} />

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
         
          fontSize="0.5"
          fill="black"
        >
          
        </text>
      </svg>
        </div>
      
      
    </>
  );
}

export default App;
let LibraryController = ({ expression, viewBox }: { expression: string,viewBox: {x:number, y:number, width:number, height:number} }) => {



}

type FunctionType = {
  expression: string[];
  pathArray: string[];
};


let General = ({ expression, viewBox }: { expression: string,viewBox: {x:number, y:number, width:number, height:number} }) => {
 
  let result = parseExpression(expression); // Parse the expression
  const functionsFromStorage = JSON.parse(localStorage.getItem("functions") || "[]");
  let isMatched = false;

  for (let i = 0; i < functionsFromStorage.length; i++) {
   
    const functionType = functionsFromStorage[i]?.functionType;
    
    if (functionType && Array.isArray(functionType.expression)) {
      const storedExpression = functionType.expression;
      
     
      const isEqual = JSON.stringify(expression) === JSON.stringify(storedExpression);
  
        
        if (isEqual) {
          console.log(`Expression matches functionType at index ${i}`);
          isMatched = true;
          break; 
        }
      
    }
  }
 


  let pathArray: string[] = [];

  let lock = true;
  let lastY = 1000;
  let j = 0;
  let step = 1000/viewBox.width
 
  for (let i = viewBox.x; i < viewBox.width; i = i + 1/step) {
    
    let x = i;
    let y = parseFloat(evaluator(result, i));
    if (isNaN(y)) {
      continue; // Skip if the result is NaN (e.g., division by zero)
    }

    if (Math.abs(lastY - y) < 0.1 ) {continue;}


    if (y > -viewBox.y) {
      y = -viewBox.y + 5;
    }
    if (y < viewBox.y) {
      y = viewBox.y - 5;
    }
   console.log(x, Math.abs(y), Math.abs(lastY), -viewBox.y)
    if (Math.abs(lastY) > -viewBox.y && Math.abs(y) > -viewBox.y && lastY * y < 0) {
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
  // merge paths 


  localStorage.setItem("functions", JSON.stringify(pathArray));
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
  const tokenRegex = /([a-zA-Z]+)|(\d*\.\d+|\d+)|([+\-*/^()|])/g;
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
  { symbol: "goldenRatioConjugate", value: (Math.sqrt(5) - 1) / 2 },]

  const brackets = [
    { symbol: ["(", ")"], fn: (a: number) => a },
    { symbol: ["|", "|"], fn: (a: number) => Math.abs(a) },
  ]

 
  // @ts-ignore
  const mergeSort = <T,>(arr: T[]): T[] => {
    // Base case: if the array has one or zero elements, it's already sorted
    if (arr.length <= 1) {
      return arr;
    }
  
    // Step 1: Split the array into two halves
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
  
    // Step 2: Recursively sort each half
    const sortedLeft = mergeSort(left);
    const sortedRight = mergeSort(right);
  
    // Step 3: Merge the two sorted halves
    return merge(sortedLeft, sortedRight);
  };
  
  // Merge function to combine two sorted arrays into one sorted array
  // @ts-ignore: Disable JSX parsing for this line
  const merge = <T,>(left: T[], right: T[]): T[] => {
    let result: T[] = [];
    let leftIndex = 0;
    let rightIndex = 0;
  
    // Merge the two arrays while there are elements in both
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }
  
    // If there are remaining elements in either array, add them to the result
    return result.concat(left.slice(leftIndex), right.slice(rightIndex));
  };
