import { evaluator } from "./Evaluator";
import {addFunction} from "./SessionStorage";
import { coords, FunctionData } from "./types";
let General = ({
  expression,
  viewBox,
  storedExpression,
}: {
  expression: string[];
  viewBox: { x: number; y: number; width: number; height: number };
  storedExpression?: FunctionData;
}) => {
  let result = expression;
  let lock2 = storedExpression ? true : false;

  
  let pathArray: string[] = [];

  let lock = true;
  let lastY = 1000;
  let j = 0;
  let step = viewBox.width / 1000; // Initial step size
let tp: number | undefined = undefined;
let tp2: number | undefined = undefined;
  if (storedExpression && storedExpression.pathArray[0][0].x < viewBox.x){
    tp = storedExpression.pathArray[storedExpression.pathArray.length - 1][storedExpression.pathArray[storedExpression.pathArray.length - 1].length - 1].x;
    tp2 = storedExpression.pathArray[storedExpression.pathArray.length - 1][storedExpression.pathArray[storedExpression.pathArray.length - 1].length - 1].x;
  }else if (storedExpression && storedExpression.pathArray[storedExpression.pathArray.length - 1][storedExpression.pathArray[storedExpression.pathArray.length - 1].length - 1].x > viewBox.x){

  }else {

  }
  let paths: coords[][] = [];
  for (let i = viewBox.x; i < viewBox.width; i = i + step) {
    if (tp !== undefined && i > tp && tp2 !== undefined) {
        i = tp2;




    }

    let x = i;
    let y = parseFloat(evaluator(result, i));
    if (isNaN(y)) {
      continue; // Skip if the result is NaN (e.g., division by zero)
    }

    //smart step
    if (Math.abs(lastY - y) < 0.001) {
      step = viewBox.width / 1000;
      continue;
    }
    if (Math.abs(lastY - y) > 1) {
      step = viewBox.width / 100000;
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
      let a: coords = { x: x, y: y };
      if (!paths[j]) {
        paths[j] = [];  // Initialize paths[j] as an empty array if not already initialized
      }
      paths[j][0] = a;
    
      pathArray[j] = `M ${Math.round(x * 1000) / 1000} ${
        Math.round(-y * 1000) / 1000
      } `;
      lock = false;
    } else {
      paths[j].push({ x: x, y: y });
      pathArray[j] =
        pathArray[j] +
        `L ${Math.round(x * 1000) / 1000} ${Math.round(-y * 1000) / 1000} `;
    }
  }
  if (lock2) {
    
  }else {
    
    addFunction({
    
      color: "black",
      expression: result,
      pathArray: paths,
    })
  }
  
  const data: React.ReactElement[] = pathArray.map((d, index) => (
    <path key={index} d={d} stroke="black" fill="none" />
  ));

  return data;
};

export default General;
