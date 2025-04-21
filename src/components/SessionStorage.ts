import { FunctionData, coords } from './types';


let appData: { functions: FunctionData[] } = { functions: [] };
let idcounter = 0;

// write me some functions that would manipulate with the appData object. The functions should be able to add, remove, replace. [DunctionDataType]
export const getFunctionDataByExpression = (expression?: string[]): FunctionData | undefined => {
  // Early return if expression is not valid
  if (!expression || !Array.isArray(expression) || expression.length === 0) {
    console.warn("Invalid expression provided to getFunctionDataByExpression");
    return undefined;
  }

  for (let i = 0; i < appData.functions.length; i++) {
    const func = appData.functions[i];

   
      const storedExpr:string[] = func.expression;

 
  
      if (
        Array.isArray(storedExpr) &&
        storedExpr.length === expression.length &&
        storedExpr.every((val, index) => val === expression[index])
      ) {
        return func;
      }
    
  }

  return undefined;
};

  export const replaceFunction = (newFunc: FunctionData, id: number): void => {
    
    const index = appData.functions.findIndex(func => func.id === id);
    if (index) {
        appData.functions[index] = newFunc;
    }
  };

  type CreatFunctionDTO = {
    
        
        color: string;
        expression: string[];
        pathArray: coords[][];
    
  }
  export const addFunction = (newFunc: CreatFunctionDTO): void => {
    const newf:FunctionData = {
      id: idcounter++,
        color: newFunc.color,
        expression: newFunc.expression,
        pathArray: newFunc.pathArray,
    };
    appData.functions.push(newf);
  };

  export const flushFunctionData = (): void => {
    appData.functions = [];
  };

  export const replacePathArray = (pathArray: coords[][], id: number): void => {
    
    const index = appData.functions.findIndex(func => func.id === id);
    if (index !== -1)  {
        appData.functions[index].pathArray = pathArray;
        logArray(appData.functions[index].pathArray);
    }
  }

  const logArray = (array: coords[][]) => {
    array.forEach((segment, index) => {
      console.log(`Segment ${index}:`);
      segment.forEach(point => {
        console.log(`x: ${point.x}, y: ${point.y}`);
      });
    });
  };