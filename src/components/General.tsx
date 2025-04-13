import { useMemo } from "react";
import { evaluator } from "./Evaluator";
import { addFunction, replacePathArray } from "./SessionStorage";
import { coords, FunctionData } from "./types";
import mergeCoords from "./utils/mergeArrays";
type ViewBox = { x: number; y: number; width: number; height: number };

const computeFullGraph = (expression: string[], viewBox: ViewBox) => {
  let localStep = viewBox.width / 1000;
  let localLastY = 1000;
  let localPaths: coords[][] = [];
  let localPathArray: string[] = [];
  let localLock = true;
  let segmentIndex = 0;

  for (let i = viewBox.x; i < viewBox.width; i += localStep) {
    let x = i;
    let y = parseFloat(evaluator(expression, i));
    if (isNaN(y)) continue;

    // Adjust step dynamically
    if (Math.abs(localLastY - y) < 0.001) {
      localStep = viewBox.width / 1000;
    }
    if (Math.abs(localLastY - y) > 1) {
      localStep = viewBox.width / 100000;
    }
    
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
    color: "black",
    expression,
    pathArray: localPaths,
  });

  // Return rendered paths
  return localPathArray.map((d, index) => (
    <path key={index} d={d} stroke="black" fill="none" />
  ));
};

const computePartialGraph = (
  expression: string[],
  viewBox: ViewBox,
  storedExpression: FunctionData
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
  }
  // (Add any additional custom logic as needed.)
  let storedsegmentIndex = 1;
  for (let i = viewBox.x; i < viewBox.width / 2; i += localStep) {
    
  


    if (
      storedsegmentIndex < storedPaths.length &&
      Array.isArray(storedPaths[storedsegmentIndex]) &&
      storedPaths[storedsegmentIndex].length > 0
    ) {
      fire = storedPaths[storedsegmentIndex][0].x;
      let lastSegment = storedPaths[storedsegmentIndex];
      tp = lastSegment[lastSegment.length - 1].x;
      storedsegmentIndex++;
    } else {
      fire = undefined;
      tp = undefined;
    }
    let x = i;
    let y = parseFloat(evaluator(expression, i));
    if (isNaN(y)) continue;

    // Adjust step dynamically
    if (Math.abs(localLastY - y) < 0.001) {
      localStep = viewBox.width / 1000;
    }
    /*
    if (Math.abs(localLastY - y) > 1500) {
      localStep = viewBox.width / 10000000;
    }
    if (Math.abs(localLastY - y) > 200) {
      localStep = viewBox.width / 1000000;
      }*/
     if (Math.abs(localLastY - y) > 1) {
      localStep = viewBox.width / 100000;
    }
    if (Math.abs(y - localLastY) > threshold) {
      
      y = y > localLastY ? viewBox.height : -viewBox.height;
    }
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
 
  const combinedPaths = localPaths.concat(storedPaths)
  logArray(combinedPaths);
  //const preparedToSaveData = sortAndMergeCoords(combinedPaths);
  //replacePathArray(preparedToSaveData, storedExpression.id);
  const mergedPaths = pathsToDStrings(combinedPaths);
 console.log("Merged Paths: ", mergedPaths);
  return mergedPaths.map((d, index) => (
    <path key={index} d={d} stroke="black" fill="none" />
  ));
};

const General = ({
  expression,
  viewBox,
  storedExpression,
}: {
  expression: string[];
  viewBox: ViewBox;
  storedExpression?: FunctionData;
}) => {

  const graph = useMemo(() => {
   
    if (storedExpression && arraysEqual(storedExpression.expression, expression)) {
      
      console.log("B: computing partial graph update");
      return computePartialGraph(expression, viewBox, storedExpression);
    } else {
      console.log("A: computing full graph");
      return computeFullGraph(expression, viewBox);
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
    const sorted = validGroups.sort((a, b) => {
        return a[0].x - b[0].x;
    });

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
