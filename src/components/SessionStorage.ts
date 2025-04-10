import { FunctionData, coords } from './types';
const STORAGE_KEY = 'functionsKey';

let appData: { functions: FunctionData[] } = { functions: [] };
let idcounter = -1;


export const getFunctionDataByExpression = (expression: string[]): FunctionData | undefined => {
    
    return appData.functions.find(func => func.expression.some(expr => expression.includes(expr)));
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