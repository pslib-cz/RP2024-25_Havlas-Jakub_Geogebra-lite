import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  let rovnice = "y = ax + b";
  let rovnice2 = "y = 1x + 5";

  return (
    <>
      <svg
        width="1000"
        height="1000"
        viewBox="-15 -15 30 30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="-15" y="-15" width="30" height="30" fill="white" />

        <g stroke="lightgray" stroke-width="0.1">
          <line x1="-15" y1="0" x2="15" y2="0" stroke="black" />
          <line y1="-15" y2="15" x1="0" x2="0" stroke="black" />
        </g>
        <LineLinear expression={rovnice2} />
        <ParaBole expression={rovnice} />
        <LinearPolygonal expression={rovnice} />
        <Sinusoid expression={rovnice} />
        <Cosinusoid expression={rovnice} />
        <Tangensoid expression={rovnice} />
       
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
  let a = 3;
  let b = -2;
  let c = -2;
  let d = 5;
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
  let path;
  for (let i = -15; i < 15; i = i + 1 / 33) {
    let x = i;
    let y = a * Math.sin(b * x + c);
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
  let pathArray = [];
  let path;
 
  let lastY = -Infinity;
  let j = 0;
  for (let i = -15; i < 15; i = i + 1 / 33) {
    let x = i;
    let y = a * Math.tan(b * x) + c;
    if (i === -15) {
      path = `M ${x} ${-y} `;
    } else {
      path = path + `L ${x} ${-y} `;
    }
    console.log(lastY, y);
    if (lastY > y) {
      pathArray.push(path);
      path = `M ${x} ${-y} `;
      lastY = -Infinity;
      j++;
    }else {
      lastY = y;
    }
   
  }
  console.log(pathArray);
  return (
    <>
      {pathArray.map((d, index) => (
        <path key={index} d={d} stroke="black" fill="none" strokeWidth={0.1}/>
      ))}
    </>
  );
};

let CoTangensoid = ({ expression }: { expression: string }) => {
  // y = a * sin(b * x + c) + d
  let a = 1;
  let b = 1;
  let c = 0;
  let path;
  
  for (let i = -15; i < 15; i = i + 1 / 33) {
    let x = i;
    let y = a * (1 / Math.tan(b * x)) + c;
    y = 1 / y;
    if (i === -15) {
      path = `M ${x} ${-y} `;
    } else {
      path = path + `L ${x} ${-y} `;
    }
  }

  return <path d={path} fill="none" stroke="brown" stroke-width="0.1" />;
};
