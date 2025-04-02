import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  
let rovnice = "y = ax + b"
let rovnice2 = "y = 1x + 5"






  return (
    <>
      <svg width="1000" height="1000" viewBox="-500 -500 1000 1000" xmlns="http://www.w3.org/2000/svg">
   
    <rect x="-500" y="-500" width="1000" height="1000" fill="white"/>
    
   
    <g stroke="lightgray" stroke-width="1">
      
        <line x1="-500" y1="0" x2="500" y2="0" stroke="black" stroke-width="2"/> 
        <line y1="-500" y2="500" x1="0" x2="0" stroke="black" stroke-width="2"/>


        <LineLinear expression={rovnice2} />
        <ParaBole expression={rovnice} />
        <LinearPolygonal expression={rovnice} />
       
        <g>
            <line x1="-450" y1="-500" x2="-450" y2="500"/>
            <line x1="-400" y1="-500" x2="-400" y2="500"/>
            <line x1="-350" y1="-500" x2="-350" y2="500"/>
            <line x1="-300" y1="-500" x2="-300" y2="500"/>
            <line x1="-250" y1="-500" x2="-250" y2="500"/>
            <line x1="-200" y1="-500" x2="-200" y2="500"/>
            <line x1="-150" y1="-500" x2="-150" y2="500"/>
            <line x1="-100" y1="-500" x2="-100" y2="500"/>
            <line x1="-50" y1="-500" x2="-50" y2="500"/>
            <line x1="50" y1="-500" x2="50" y2="500"/>
            <line x1="100" y1="-500" x2="100" y2="500"/>
            <line x1="150" y1="-500" x2="150" y2="500"/>
            <line x1="200" y1="-500" x2="200" y2="500"/>
            <line x1="250" y1="-500" x2="250" y2="500"/>
            <line x1="300" y1="-500" x2="300" y2="500"/>
            <line x1="350" y1="-500" x2="350" y2="500"/>
            <line x1="400" y1="-500" x2="400" y2="500"/>
            <line x1="450" y1="-500" x2="450" y2="500"/>
        </g>
        
      
        <g>
            <line y1="-450" x1="-500" y2="-450" x2="500"/>
            <line y1="-400" x1="-500" y2="-400" x2="500"/>
            <line y1="-350" x1="-500" y2="-350" x2="500"/>
            <line y1="-300" x1="-500" y2="-300" x2="500"/>
            <line y1="-250" x1="-500" y2="-250" x2="500"/>
            <line y1="-200" x1="-500" y2="-200" x2="500"/>
            <line y1="-150" x1="-500" y2="-150" x2="500"/>
            <line y1="-100" x1="-500" y2="-100" x2="500"/>
            <line y1="-50" x1="-500" y2="-50" x2="500"/>
            <line y1="50" x1="-500" y2="50" x2="500"/>
            <line y1="100" x1="-500" y2="100" x2="500"/>
            <line y1="150" x1="-500" y2="150" x2="500"/>
            <line y1="200" x1="-500" y2="200" x2="500"/>
            <line y1="250" x1="-500" y2="250" x2="500"/>
            <line y1="300" x1="-500" y2="300" x2="500"/>
            <line y1="350" x1="-500" y2="350" x2="500"/>
            <line y1="400" x1="-500" y2="400" x2="500"/>
            <line y1="450" x1="-500" y2="450" x2="500"/>
        </g>
    </g>
    
   
    <g font-family="Arial" font-size="20" fill="black" text-anchor="middle">
        <text x="100" y="-10">100</text>
        <text x="200" y="-10">200</text>
        <text x="300" y="-10">300</text>
        <text x="400" y="-10">400</text>
        <text x="-100" y="-10">-100</text>
        <text x="-200" y="-10">-200</text>
        <text x="-300" y="-10">-300</text>
        <text x="-400" y="-10">-400</text>
        
        <text x="10" y="100">-100</text>
        <text x="10" y="200">-200</text>
        <text x="10" y="300">-300</text>
        <text x="10" y="400">-400</text>
        <text x="10" y="-100">100</text>
        <text x="10" y="-200">200</text>
        <text x="10" y="-300">300</text>
        <text x="10" y="-400">400</text>
    </g>
</svg>

    </>
  )
}

export default App

let LineLinear = ({ expression }: { expression: string }) => { 
 

  let a = parseFloat(expression.split("x")[0].trim().charAt(4));
  let b = parseFloat(expression.split("+")[1].trim());

  console.log(a, b);
    return (
      <line x1="-500" y1={500 * a - b} x2="500" y2={-500 * a + b} stroke="red" stroke-width="2"/>
    )
}

let ParaBole = ({ expression }: { expression: string }) => {
  // y = ax^2 + bx + c
let a = -1
let b = -30;
let c = 50;
let x = -500;
    let y = a * x * x + b * x + c;
let path = `M ${x} ${-y} `
 for (let i = -499; i < 500; i++) {
    let x = i;
    let y = a * x * x + b * x + c;
    path = path + `L ${x} ${-y} `
  }

return (

  <path d={`M 0 0 ${path}`} fill="none" stroke="blue" stroke-width="2"/>
)
}
let LinearPolygonal = ({ expression }: { expression: string }) => {
  // y = (ax + b) / (cx + d)
  let a = 3;
  let b = -2;
  let c = -2;
  let d = 5;

  let x = -5000/100;
  let path = `M ${x} ${(((a * x) + b) / ((c * x) + d))} `;
  console.log(path);
  for (let i = -4999; i < 5000; i++) {
    let x = i/100;
    let y = (a * x + b) / (c * x + d);
    if (y == Infinity){
      continue;
    }
    if (y > 50){
      y = 50;
    }
    if (y < -50){
      y = -50;
    }
    path = path + `L ${x} ${-y} `;
    console.log(x, y);
   
  }

  return (
    <path d={path} fill="none" stroke="blue" stroke-width="2" />
  );
};

