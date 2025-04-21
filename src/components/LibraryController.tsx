import React, { useEffect, useRef, useState } from "react";
import General from "./General";
import  { parseExpression }  from "./utils/ParseExpression"
import  generateGrid  from "./utils/generateGrid";
import { ViewBox } from "./types"; 
import useDebounce from "./CustomHooks/useDebounce";
// Define the ViewBox type
import {  getFunctionDataByExpression, replaceFunction, addFunction, flushFunctionData } from './SessionStorage';
import { FunctionData, reqs } from './types';
import Picker from "./Picker";
let LibraryController = ({
    reqs,
    params,
  }: {
    reqs: reqs[];
    params: { x: number; y: number; width: number; height: number };
  }) => {
    //const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

    const [viewBox, setViewBox] = useState({
      x: params.x,
      y: params.y,
      width: params.width,
      height: params.height,
    });
    const [debouncedViewBox, setDebouncedViewBox] = useState(viewBox);
    useDebounce(() => {
      setDebouncedViewBox(viewBox);
    }, 300, [viewBox]);
    let expressions: FunctionData[] = [];
   for (let i = 0; i < reqs.length; i++) {
      let expression = parseExpression(reqs[i].expression);
      let color = reqs[i].color;
      expressions[i] = {
        id: i,
        color: color,
        expression: expression,
        pathArray: [],
      }
    }
 




    

   
    
     
    
  
    const svgRef = useRef<SVGSVGElement | null>(null);


    const isPanning = useRef(false);
    const startPoint = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
      isPanning.current = true;
      startPoint.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseMove = (e: React.MouseEvent) => {
      // if (svgRef.current) {
      //   const svgRect = svgRef.current.getBoundingClientRect();
    
      //   const svgX = viewBox.x + (e.clientX - svgRect.left) * (viewBox.width / svgRect.width);
      //   const svgY = viewBox.y + (e.clientY - svgRect.top) * (viewBox.height / svgRect.height);
    
      //   setMousePos({ x: svgX, y: svgY });
      // }
      if (!isPanning.current || !svgRef.current) return;
  
      const dx = (e.clientX - startPoint.current.x) * (viewBox.width / svgRef.current.clientWidth);
      const dy = (e.clientY - startPoint.current.y) * (viewBox.height / svgRef.current.clientHeight);
  
      setViewBox((prev) => ({
        ...prev,
        x: prev.x - dx,
        y: prev.y - dy,
      }));
  
      startPoint.current = { x: e.clientX, y: e.clientY };
    };
    const endPan = () => {
      isPanning.current = false;
      //setMousePos(null); // clear when leaving
    };
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
  
      const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
  
      setViewBox((prev: { x: number; y: number; width: number; height: number }) => {
        
        const centerX = prev.x + prev.width / 2;
        const centerY = prev.y + prev.height / 2;
  
        const newWidth = prev.width * zoomFactor;
        const newHeight = prev.height * zoomFactor;
        if (newWidth > 10000 || newHeight < 0.001) {
          return prev; // Prevent zooming out too much
        }
        return {
          width: newWidth,
          height: newHeight,
          x: centerX - newWidth / 2,
          y: centerY - newHeight / 2,
        };
      });
    };
    useEffect(() => {}, [viewBox]);
    useEffect(() => {
      const svg = svgRef.current;
  
      if (!svg) return;
  
      svg.addEventListener("wheel", handleWheel, { passive: false });
  
      return () => {
        svg.removeEventListener("wheel", handleWheel);
      };
    }, []);
    const getStrokeWidth = (viewBox: ViewBox): number => {
      // Adjust multiplier to your liking
      return viewBox.width / 1000;
    };
    const strokeWidth = getStrokeWidth(viewBox);
   
    const grid = generateGrid(viewBox);
    return (
        <svg
        ref={svgRef}
        width="1000"
        height="1000"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        style={{ width: "100%", height: "auto", border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endPan}
        onMouseLeave={endPan}
      >
     {/* {mousePos && (
  <text
    x={mousePos.x + 0.5 * (viewBox.width / 30)} 
    y={mousePos.y - 0.5 * (viewBox.height / 30)} 
    fontSize={0.5 * (viewBox.width / 30)}
    fill="red"
    alignmentBaseline="middle"
    style={{ pointerEvents: "none", userSelect: "none" }}
  >
    ({mousePos.x.toFixed(2)}, {mousePos.y.toFixed(2)})
  </text>
)} */}
        <rect
          x={viewBox.x}
          y={viewBox.y}
          width={viewBox.width}
          height={viewBox.height}
          fill="white"
        />
 <g fill="none" stroke="black" strokeWidth={strokeWidth}>
  
 {viewBox === debouncedViewBox ? <Picker expressions={expressions} params={viewBox} /> : null}
 </g>
        
        
        <g stroke="lightgray" strokeWidth={strokeWidth}>
          {grid.vertical.map((x) => (
            <line key={`v-${x}`} x1={x} y1={viewBox.y} x2={x} y2={viewBox.y + viewBox.height} />
          ))}
          {grid.horizontal.map((y) => (
            <line key={`h-${y}`} y1={y} x1={viewBox.x} y2={y} x2={viewBox.x + viewBox.width} />
          ))}
        </g>
      
      
        <line x1={viewBox.x} y1={0} x2={viewBox.x + viewBox.width} y2={0} stroke="black"  strokeWidth={strokeWidth}/>
        <line x1={0} y1={viewBox.y} x2={0} y2={viewBox.y + viewBox.height} stroke="black" strokeWidth={strokeWidth}/>
      
        
        <g fontFamily="Arial" fontSize={0.5 * (viewBox.width / 30)} fill="black" textAnchor="middle">
          {grid.labels.map((label, i) => (
            <text key={`label-${i}`} x={label.x} y={label.y}   style={{ pointerEvents: "none", userSelect: "none" }}>
              {label.text}
            </text>
          ))}
        </g>
      </svg>
    );
  };

  export default LibraryController;