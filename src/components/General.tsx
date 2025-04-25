import { useMemo } from "react";
import { evaluator } from "./Evaluator";
import { addFunction } from "./SessionStorage";
import { coords, FunctionData } from "./types";

type ViewBox = { x: number; y: number; width: number; height: number };

const computeFullGraph = (expression: string[], viewBox: ViewBox,  color?: string) => {
  let localStep = viewBox.width / 10000;

  let localLastY = 1000;
  let localPaths: coords[][] = [];
  
  let localLock = true;
  let segmentIndex = 0;
 
  for (let i = viewBox.x; i < (viewBox.width / 2) + localStep; i += localStep) {
    let x = i;
    
    let y = parseFloat(evaluator(expression, i));
   
    if (isNaN(y)) {localLock = true; continue;}
    /*
     let threshold = viewBox.width / 10000 * 30;
  
  let recentPoints: coords[] = [];
 let counter = 0;
    let ans = deltaY({x: x, y: y}, {x: x, y: localLastY})
    if ( curvatureScore(recentPoints) < 0.1 && ans < 0.1) {

      localStep = viewBox.width / 100;
    }
    if ( ans > threshold) {
      
     
      localStep = viewBox.width / 100000;
    }

    recentPoints.push({ x, y });
    if (recentPoints.length > 5) {
      recentPoints.shift(); // remove the oldest point
    }
    */
    if (y > -viewBox.y +1) continue
    if (y < viewBox.y - 1 ) continue;
    
    // Handling discontinuities

    if (Math.abs(localLastY) > -viewBox.y && Math.abs(y) > -viewBox.y && localLastY * y < 0) {
      
      localStep = viewBox.width / 10000;
      localLastY = 100;
      
      localLock = true;
     
     
    } 
      localLastY = y;
    

    if (localLock) {
      segmentIndex++;
      const point: coords = { x, y };
      if (!localPaths[segmentIndex]) localPaths[segmentIndex] = [];
      localPaths[segmentIndex][0] = point;
    
      localLock = false;
    } else {
      localPaths[segmentIndex].push({ x, y });
     
    }
  }

 
  addFunction({
    color: `${color || "black"}`,
    expression,
    pathArray: localPaths,
  });
  const mergedPaths = pathsToDStrings(localPaths);
  return mergedPaths.map((d, index) => (
    <path key={index} d={d} stroke={color || "black"} fill="none" />
  ));
};

const computePartialGraph = (
  
  expression: string[],
  viewBox: ViewBox,
  storedExpression: FunctionData,
  color?: string
) => {
  
  let localStep = viewBox.width / 20000;
  let localLastY = 1000;
  let localPaths: coords[][] = [];
 
  let localLock = true;
  let segmentIndex = 0;
  


  let threshold = viewBox.width / 10000 * 30;
  const storedPaths = storedExpression.pathArray;




 
    
  let recentPoints: coords[] = [];
 
  let storedsegmentIndex = 0;

  for (let i = viewBox.x; i < viewBox.x + viewBox.width + localStep; i += localStep) {
    
  
    if ( storedPaths[storedsegmentIndex] && storedPaths[storedsegmentIndex][0].x < i) {

     console.log("fire ", storedsegmentIndex, storedPaths[storedsegmentIndex][0].x, i)
      
      i = storedPaths[storedsegmentIndex][storedPaths[storedsegmentIndex].length - 1].x;
      if (!localPaths[segmentIndex]) {
        localPaths[segmentIndex] = [];
      }
      localPaths[segmentIndex].push(...storedPaths[storedsegmentIndex]);
      localLock = false;
      storedsegmentIndex++;
    }
    

    let x = i;
    
    let y = parseFloat(evaluator(expression, i));
    
    if (isNaN(y)) {localLock = true; continue;}

    let ans = deltaY({x: x, y: y}, {x: x, y: localLastY})
    /*
    if ( curvatureScore(recentPoints) < 0.00001 && ans < 0.1) {

      localStep = viewBox.width / 100;
    }*/
    if ( ans > threshold) {
      
  
      localStep = viewBox.width / 3000000;
    }

    recentPoints.push({ x, y });
    if (recentPoints.length > 5) {
      recentPoints.shift(); // remove the oldest point
    }
    
    if (y > -viewBox.y + 5) continue
    if (y < viewBox.y - 5) continue;

    if (Math.abs(localLastY) > -viewBox.y && Math.abs(y) > -viewBox.y && localLastY * y < 0) {
      localStep = viewBox.width / 10000;
      localLastY = viewBox.height;
      
      localLock = true;
      
    } 
      localLastY = y;
    

    if (localLock) {
      segmentIndex++;
      const point: coords = { x, y };
      
      if (!localPaths[segmentIndex]) localPaths[segmentIndex] = [];
      localPaths[segmentIndex][0] = point;
     
      localLock = false;
    } else {
      
      localPaths[segmentIndex].push({ x, y });
     
    }
  }

  
 


  

  const updatedExpression: FunctionData = {
    ...storedExpression,
    pathArray: localPaths,
  };

  const mergedPaths = pathsToDStrings(updatedExpression.pathArray);
  
  return mergedPaths.map((d, index) => (
    <path key={index} d={d} stroke={color || "black"} fill="none" />
  ));
};

const General = ({
  expression,
  viewBox,
  storedExpression,
  color
}: {
  expression: string[];
  viewBox: ViewBox;
  storedExpression?: FunctionData;
  color?: string;
}) => {

  const graph = useMemo(() => {
   
    if (storedExpression && arraysEqual(storedExpression.expression, expression)) {
      
      console.log("B: computing partial graph update");
      return computePartialGraph(expression, viewBox, storedExpression, color);
    } else {
      console.log("A: computing full graph");
      return computeFullGraph(expression, viewBox, color);
    }
  }, [expression, viewBox, storedExpression]);
  



  return (
    <>
      {graph}
      
    </>
  );
};
const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((val, index) => val === b[index]);
export default General;

//ai.
//write a fc that would make a d string from coords[][]
const pathsToDStrings = (paths: coords[][]): string[] => {
  return paths
    
    .map(segment => {
      const commands = segment.map((point, i) => {
        const x = +point.x.toFixed(6);
        const y = +(-point.y).toFixed(6); // negate y for SVG coords
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      });
      return commands.join(" ");
    });
};
//ai.
//write log 2Darray function on coords[][].

//ai.
//write a function that will sort array in arrays according to first x. 


function deltaY(coord1: coords, coord2: coords): number {
let y1 = Math.abs(coord1.y);
let y2 = Math.abs(coord2.y);
  return y1 - y2;
}





