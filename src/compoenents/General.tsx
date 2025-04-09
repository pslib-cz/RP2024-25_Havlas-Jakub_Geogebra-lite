

import evaluator from "./Evaluator";

let General = ({
    expression,
    viewBox,
    storedExpression,
  }: {
    expression: string[];
    viewBox: { x: number; y: number; width: number; height: number };
    storedExpression?: string;
  }) => {
    let result = expression;
  
    let pathArray: string[] = [];
   
    let lock = true;
    let lastY = 1000;
    let j = 0;
    let step = 1000 / viewBox.width;
   
    
    for (let i = viewBox.x; i < viewBox.width; i = i + 1 / step) {
      let x = i;
      let y = parseFloat(evaluator(result, i));
      if (isNaN(y)) {
        continue; // Skip if the result is NaN (e.g., division by zero)
      }
  
      //smart step
      if (Math.abs(lastY - y) < 0.001) {
        step = 1000 / viewBox.width;
        continue;
      }
      if (Math.abs(lastY - y) > 1) {
        step = 100000 / viewBox.width;
      }
  
      if (y > -viewBox.y) {
        y = -viewBox.y + 5;
      }
      if (y < viewBox.y) {
        y = viewBox.y - 5;
      }
  
      if (
        Math.abs(lastY) > -viewBox.y &&
        Math.abs(y) > -viewBox.y &&
        lastY * y < 0
      ) {
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
  
    localStorage.setItem("functions", JSON.stringify(pathArray));
    const data: React.ReactElement[] = pathArray.map((d, index) => (
      <path key={index} d={d} stroke="black" fill="none" strokeWidth={0.01} />
    ));
    return data;
  };

  export default General;