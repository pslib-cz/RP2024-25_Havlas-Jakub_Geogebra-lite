import { useMemo } from "react";
import { evaluator } from "./Evaluator";
import { addFunction, replacePathArray } from "./SessionStorage";
import { coords, FunctionData } from "./types";

type ViewBox = { x: number; y: number; width: number; height: number };

const computeFullGraph = (expression: string[], viewBox: ViewBox,  color?: string) => {
  let localStep = viewBox.width / 10000;

  let localLastY = 1000;
  let localPaths: coords[][] = [];
  
  let localLock = true;
  let segmentIndex = 0;
  let threshold = viewBox.width / 10000 * 30;
  
  let recentPoints: coords[] = [];
 let counter = 0;
  for (let i = viewBox.x; i < (viewBox.width / 2) + localStep; i += localStep) {
    let x = i;
    
    let y = parseFloat(evaluator(expression, i));
   
    if (isNaN(y)) {localLock = true; continue;}
    /*
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
  let localPathArray: string[] = [];
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
const logArray = (array: coords[][]) => {
  array.forEach((segment, index) => {
    console.log(`Segment ${index}:`);
    segment.forEach(point => {
      console.log(`x: ${point.x}, y: ${point.y}`);
    });
  });
};
//ai.
//write a function that will sort array in arrays according to first x. 
function sortAndMergeCoords(groups: coords[][]): coords[][] {
  const validGroups = groups.filter(g => Array.isArray(g) && g.length > 0);
  const sorted = [...validGroups].sort((a, b) => a[0].x - b[0].x);
  const result: coords[][] = [];

  const X_GAP_THRESHOLD = 0.01; // You can adjust this based on your resolution

  for (const group of sorted) {
    if (result.length === 0) {
      result.push(group);
      continue;
    }

    const lastGroup = result[result.length - 1];
    const lastPoint = lastGroup[lastGroup.length - 1];
    const firstPoint = group[0];

    const xGap = firstPoint.x - lastPoint.x;
    const ySignChanged = lastPoint.y * firstPoint.y < 0;

    const isGapTooBig = xGap > X_GAP_THRESHOLD;

    if (isGapTooBig || ySignChanged) {
      result.push(group);
    } else {
      // Safe to merge
      result[result.length - 1] = lastGroup.concat(group);
    }
  }

  return result;
}

function deltaY(coord1: coords, coord2: coords): number {
let y1 = Math.abs(coord1.y);
let y2 = Math.abs(coord2.y);
  return y1 - y2;
}





function curvatureScore(coords: coords[], sensitivity = 2): number {
  if (coords.length < 3) {
      return 0;
  }

  const angleBetween = (a: coords, b: coords, c: coords): number => {
      const ab = [b.x - a.x, b.y - a.y];
      const bc = [c.x - b.x, c.y - b.y];

      const dot = ab[0] * bc[0] + ab[1] * bc[1];
      const magAB = Math.sqrt(ab[0]**2 + ab[1]**2);
      const magBC = Math.sqrt(bc[0]**2 + bc[1]**2);

      if (magAB === 0 || magBC === 0) return 0;

      const cosTheta = dot / (magAB * magBC);
      const clamped = Math.max(-1, Math.min(1, cosTheta));

      return Math.acos(clamped); // in radians
  };

  let totalAngle = 0;
  let count = 0;

  for (let i = 0; i < coords.length - 2; i++) {
      const angle = angleBetween(coords[i], coords[i+1], coords[i+2]);
      totalAngle += angle;
      count++;
  }

  const avgAngle = count > 0 ? totalAngle / count : 0;

  // Normalize to 0–1 (π is max possible)
  let normalized = avgAngle / Math.PI;

  // Make it more sensitive: exaggerate small changes using a nonlinear boost
  normalized = Math.pow(normalized, 1 / sensitivity); // e.g., sqrt for sensitivity = 2

  return parseFloat(normalized.toFixed(6));
}
const findLastPointInMatchingRow = (
  coords: { x: number; y: number }[][],
  viewBoxX: number,
  localStep: number
): { x: number; y: number } | null => {
  for (let m = 0; m < coords.length; m++) {
    const row = coords[m];

    if (!row || row.length === 0) continue; // <-- skip empty or undefined rows

    for (let n = 0; n < row.length; n++) {
      const point = row[n];
      if (
        point &&
        point.x >= viewBoxX - localStep &&
        point.x < viewBoxX
      ) {
        return row[row.length - 1]; // safe now
      }
    }
  }

  return null;
};