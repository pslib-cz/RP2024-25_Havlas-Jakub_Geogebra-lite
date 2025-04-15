import { useMemo } from "react";
import { evaluator } from "./Evaluator";
import { addFunction, replacePathArray } from "./SessionStorage";
import { coords, FunctionData } from "./types";
import mergeCoords from "./utils/mergeArrays";
type ViewBox = { x: number; y: number; width: number; height: number };

const computeFullGraph = (expression: string[], viewBox: ViewBox,  color?: string) => {
  let localStep = viewBox.width / 1000;
  
  let localLastY = 1000;
  let localPaths: coords[][] = [];
  let localPathArray: string[] = [];
  let localLock = true;
  let segmentIndex = 0;
  let recentPoints: coords[] = [];
 let counter = 0;
  for (let i = viewBox.x; i < viewBox.width; i += localStep) {
    let x = i;
    
    let y = parseFloat(evaluator(expression, i));
   
    if (isNaN(y)) continue;
    /*
    const point: coords = { x, y };
    
   
    if ( counter % 100 == 0){
      recentPoints.push(point);
      counter = 0;
    }else {
      counter++;
    }
   
   
    // Keep only the latest 51 points (we need up to x-50)
    if (recentPoints.length > 21) recentPoints.shift();
    // SMART STEP BABY
    if (
      recentPoints.length >= 21 // ensure we have enough data

    ) {
      let a = computeHybridLikelihood(recentPoints);
      if ( a ==  0 ){
        a = 0.1;
      } else if ( a == 1 ){
        a = 0.5;
      }
      
      localStep = localStep / a;
      if (localStep > viewBox.width / 50) localStep = viewBox.width / 50;
      console.log("Likelihood: ", localStep);
    }
    */
    
    // Clamping based on viewBox
    if (y > -viewBox.y +1) continue
    if (y < viewBox.y - 1 ) continue;
    
    // Handling discontinuities
    if (Math.abs(localLastY) > -viewBox.y && Math.abs(y) > -viewBox.y && localLastY * y < 0) {
      localLastY = 100;
      segmentIndex++;
      localLock = true;
      continue;
    } else {
      localLastY = y;
    }

    if (localLock) {
      const point: coords = { x, y };
      if (!localPaths[segmentIndex]) localPaths[segmentIndex] = [];
      localPaths[segmentIndex][0] = point;
      localPathArray[segmentIndex] = `M ${+x.toFixed(6)} ${+(-y).toFixed(6)} `;
      localLock = false;
    } else {
      localPaths[segmentIndex].push({ x, y });
      localPathArray[segmentIndex] += `L ${+x.toFixed(6)} ${+(-y).toFixed(6)} `;
    }
  }

  // Cache the result
  addFunction({
    color: `${color || "black"}`,
    expression,
    pathArray: localPaths,
  });

  // Return rendered paths
  return localPathArray.map((d, index) => (
    <path key={index} d={d} stroke={color || "black"} fill="none" />
  ));
};

const computePartialGraph = (
  expression: string[],
  viewBox: ViewBox,
  storedExpression: FunctionData,
  color?: string
) => {
  // Only update the parts based on the viewBox
  let localStep = viewBox.width / 1000;
  let localLastY = 1000;
  let localPaths: coords[][] = [];
  let localPathArray: string[] = [];
  let localLock = true;
  let segmentIndex = 0;
  
  // Use some values from storedExpression to decide where to skip or teleport.
  let fire: number | undefined;
  let tp: number | undefined;
  let threshold = 100;
  const storedPaths = storedExpression.pathArray;
  
  if (storedPaths[0][0].x > viewBox.x) {
    fire = storedPaths[0][0].x;
    let lastSegment = storedPaths[0];
    tp = lastSegment[lastSegment.length - 1].x;
  }else {
    //viewbox is smaller
    // higher detail is needed
  }
  let recentPoints: coords[] = [];
  // (Add any additional custom logic as needed.)
  let storedsegmentIndex = 1;
  let counter = 0;
  for (let i = viewBox.x; i < viewBox.width / 2; i += localStep) {
    
  


    if (
      fire && fire < i && tp
    ) {
      i = tp
      localLock = true;
      segmentIndex++;
      if ( storedPaths[storedsegmentIndex]) {
        fire = storedPaths[storedsegmentIndex][0].x;
        let lastSegment = storedPaths[storedsegmentIndex];
        tp = lastSegment[lastSegment.length - 1].x;

        storedsegmentIndex++;
      }else {
        fire = undefined;
        tp = undefined;
      }

      
    } 
    let x = i;
    let y = parseFloat(evaluator(expression, i));
    if (isNaN(y)) continue;
/*
    const point: coords = { x, y };
    if ( counter % 100 == 0){
      recentPoints.push(point);
      counter = 0;
    }else {
      counter++;
    }
    
    
    // Keep only the latest 51 points (we need up to x-50)
    if (recentPoints.length > 21) recentPoints.shift();
    // SMART STEP BABY
    if (
      recentPoints.length >= 21 // ensure we have enough data

    ) {
      let a = computeHybridLikelihood(recentPoints);
      if ( a ==  0 ){
        a = 0.1;
      } else if ( a == 1 ){
        a = 0.5;
      }
      
      localStep = localStep / a;
      if (localStep > viewBox.width / 50) localStep = viewBox.width / 50;
      console.log("Likelihood: ", localStep);
    }
    */
   
    /*
    if (Math.abs(y - localLastY) > threshold) {
      
      y = y > localLastY ? viewBox.height : -viewBox.height;
    }
      */
    if (y > -viewBox.y + 5) continue
    if (y < viewBox.y - 5) continue;

    if (Math.abs(localLastY) > -viewBox.y && Math.abs(y) > -viewBox.y && localLastY * y < 0) {
      localLastY = viewBox.height;
      segmentIndex++;
      localLock = true;
      continue;
    } else {
      localLastY = y;
    }

    if (localLock) {
      const point: coords = { x, y };
      
      if (!localPaths[segmentIndex]) localPaths[segmentIndex] = [];
      localPaths[segmentIndex][0] = point;
      localPathArray[segmentIndex] = `M ${+x.toFixed(6)} ${+(-y).toFixed(6)} `;
      localLock = false;
    } else {
      
      localPaths[segmentIndex].push({ x, y });
      localPathArray[segmentIndex] += `L ${+x.toFixed(6)} ${+(-y).toFixed(6)} `;
    }
  }
 
  
  const combinedPaths = [...localPaths.map(path => [...path]), ...storedPaths.map(path => [...path])];


  const preparedToSaveData = sortAndMergeCoords(combinedPaths);

  const updatedExpression: FunctionData = {
    ...storedExpression,
    pathArray: preparedToSaveData,
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
  


  // Render whichever graph is appropriate. For instance,
  // if we have a storedExpression and viewBox has changed, show the combined graph.
  return (
    <>
      {graph}
      
    </>
  );
};
const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((val, index) => val === b[index]);
export default General;

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


const logArray = (array: coords[][]) => {
  array.forEach((segment, index) => {
    console.log(`Segment ${index}:`);
    segment.forEach(point => {
      console.log(`x: ${point.x}, y: ${point.y}`);
    });
  });
};

function sortAndMergeCoords(groups: coords[][]): coords[][] {
    // Filter out undefined or empty groups first
    const validGroups = groups.filter(g => Array.isArray(g) && g.length > 0);

    // Step 1: Sort groups by the first x
    const sorted = [...validGroups].sort((a, b) => a[0].x - b[0].x);

    // Step 2: Merge groups where appropriate
    const result: coords[][] = [];

    for (const group of sorted) {
        const firstY = group[0].y;

        if (result.length === 0) {
            result.push(group);
            continue;
        }

        const lastGroup = result[result.length - 1];
        const lastY = lastGroup[lastGroup.length - 1].y;

        const isAsymptote = lastY * firstY < 0;

        if (isAsymptote) {
            result.push(group); // keep separate
        } else {
            result[result.length - 1] = lastGroup.concat(group); // merge
        }
    }

    return result;
}

function angleBetween(a: coords, b: coords, c: coords): number {
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };

  const dot = ab.x * bc.x + ab.y * bc.y;
  const magAB = Math.hypot(ab.x, ab.y);
  const magBC = Math.hypot(bc.x, bc.y);

  if (magAB === 0 || magBC === 0) return 0;

  const cosTheta = dot / (magAB * magBC);
  const clamped = Math.max(-1, Math.min(1, cosTheta)); // clamp to avoid floating point noise

  const angleRad = Math.acos(clamped);
  const angleDeg = (angleRad * 180) / Math.PI;

  return angleDeg;
}

function computeHybridLikelihood(points: coords[]): number {
  if (points.length < 3) return 0;

  let totalAngle = 0;
  let totalSlopeDelta = 0;
  let count = 0;

  for (let i = 0; i < points.length - 2; i++) {
    const a = points[i], b = points[i + 1], c = points[i + 2];

    // --- ANGLE ---
    const angle = angleBetween(a, b, c);
    const boostedAngle = Math.pow(angle / 180, 0.5); // sensitivity boost
    if (!isNaN(boostedAngle) && isFinite(boostedAngle)) {
      totalAngle += boostedAngle;
    }

    // --- SLOPE DELTA ---
    const dx1 = b.x - a.x;
    const dy1 = b.y - a.y;
    const dx2 = c.x - b.x;
    const dy2 = c.y - b.y;

    if (dx1 === 0 || dx2 === 0) continue; // avoid divide by zero

    const slope1 = dy1 / dx1;
    const slope2 = dy2 / dx2;

    const deltaSlope = Math.abs(slope2 - slope1);
    if (!isNaN(deltaSlope) && isFinite(deltaSlope)) {
      totalSlopeDelta += deltaSlope;
    }

    count++;
  }

  if (count === 0) return 0;

  const avgAngle = totalAngle / count;
  const avgDeltaSlope = totalSlopeDelta / count;

  // Normalize: 0-1 range
  const likelihood = Math.min(1, avgAngle + avgDeltaSlope / 10);
  return Math.round(likelihood * 100);
}