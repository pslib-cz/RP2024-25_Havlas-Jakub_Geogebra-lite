import { evaluator } from "./Evaluator";

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
  let step = viewBox.width / 1000; // Initial step size

  for (let i = viewBox.x; i < viewBox.width; i = i + step) {
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

  const data: React.ReactElement[] = pathArray.map((d, index) => (
    <path key={index} d={d} stroke="black" fill="none" />
  ));

  return data;
};

export default General;
