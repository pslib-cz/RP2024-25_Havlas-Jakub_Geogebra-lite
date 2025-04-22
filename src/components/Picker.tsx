import React, { useEffect, useRef, useState } from "react";
import General from "./General";

import { ViewBox } from "./types"; 

// Define the ViewBox type
import {  getFunctionDataByExpression, replaceFunction, addFunction, flushFunctionData } from './SessionStorage';
import { FunctionData } from './types';
let Picker = ({
    expressions,
    params,
  }: {
    expressions: FunctionData[];
    params: ViewBox;
  }) => {

   let data: React.ReactElement[] = [];

    for (let i = 0; i < expressions.length; i++) {
    
      let storedExpression: FunctionData | undefined = getFunctionDataByExpression(expressions[i].expression);
 
      if (storedExpression) {
        
        data[i] = <General  key={i}  expression={expressions[i].expression} viewBox={params} storedExpression={storedExpression} color={expressions[i].color}/>;
      } else {
        
            data[i] =<General  key={i}  expression={expressions[i].expression} viewBox={params} color={expressions[i].color}/>;
      }
    }

    return (
        <>
        {data}
        </>
    );
  };

  export default Picker;