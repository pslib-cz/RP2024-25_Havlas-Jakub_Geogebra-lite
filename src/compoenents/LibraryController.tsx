import React, { useEffect, useRef, useState } from "react";
import General from "./General";
import  parseExpression  from "./ParseExpression";

let LibraryController = ({
    expressions,
    params,
  }: {
    expressions: string[];
    params: { x: number; y: number; width: number; height: number };
  }) => {
    const [viewBox, setViewBox] = useState({
      x: params.x,
      y: params.y,
      width: params.width,
      height: params.height,
    });
    let data: React.ReactElement[] = [];
    
    let result = parseExpression(expressions[0]); // Parse the expression
    let isMatched = false;
    
      data.push(<General expression={result} viewBox={viewBox} />);
    
  
    const svgRef = useRef<SVGSVGElement | null>(null);
  
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
  
      const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
  
      setViewBox((prev: { x: number; y: number; width: number; height: number }) => {
        const centerX = prev.x + prev.width / 2;
        const centerY = prev.y + prev.height / 2;
  
        const newWidth = prev.width * zoomFactor;
        const newHeight = prev.height * zoomFactor;
  
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
  
    return (
      <svg
        ref={svgRef}
        width="1000"
        height="1000"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        style={{ width: "100%", height: "auto", border: "1px solid black" }}
      >
        <rect x="-15" y="-15" width="30" height="30" fill="white" />
  
        <g stroke="lightgray" stroke-width="0.1">
          <line x1="-15" y1="0" x2="15" y2="0" stroke="black" />
          <line y1="-15" y2="15" x1="0" x2="0" stroke="black" />
        </g>
  
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
        {data}
        <g font-family="Arial" font-size="0.5" fill="black" text-anchor="middle">
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
  
        <text fontSize="0.5" fill="black"></text>
      </svg>
    );
  };

  export default LibraryController;