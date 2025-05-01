import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

import { parseExpression } from "../utils/ParseExpression";
import generateGrid from "../utils/generateGrid";
import { ViewBox } from "../types";
import useDebounce from "../CustomHooks/useDebounce";
import "../../App.css";
import "./LibraryController.css";
import "../Library.css";
// Define the ViewBox type

import { FunctionData, reqs } from "../types";
import Picker from "../Picker/Picker";
let LibraryController = ({
  reqs,
  params = { x: -2, y: -2, width: 4, height: 4 },
  moveable = true,
  minWidth = 0.001,
  maxWidth = 200,
  displayCoords = true,
  displayGrid = true,
}: {
  reqs: reqs[];
  params?: ViewBox;
  moveable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  displayCoords?: boolean;
  displayGrid?: boolean;
}) => {
  const [reqsData, setReqsData] = useState<reqs[]>(reqs);

  useEffect(() => {
    setReqsData(reqs);
  }, [reqs]);

  //data normalization

  const expressions = useMemo(() => {
    return reqsData
      .map((req, i) => {
        if (!req || !req.expression) return null;
        return {
          id: i,
          color: req.color,
          expression: parseExpression(req.expression),
          pathArray: [],
        };
      })
      .filter(Boolean) as FunctionData[];
  }, [reqsData]);

  const updateViewBox = useCallback(() => {
    const container = document.querySelector(".svg-section");
    if (!container) return;

    const { clientWidth, clientHeight } = container;
    const aspect = clientWidth / clientHeight;

    const baseHeight = 4;
    const newWidth = baseHeight * aspect;

    setViewBox({
      x: -newWidth / 2,
      y: -baseHeight / 2,
      width: newWidth,
      height: baseHeight,
    });
  }, []);

  useDebounce(updateViewBox, 200, [updateViewBox]);

  const lastTouchDistance = useRef<number | null>(null);
  const isTouchPanning = useRef(false);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);

  const getDistance = (touch1: Touch, touch2: Touch) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const getCenter = (touch1: Touch, touch2: Touch, element: SVGSVGElement) => {
    const x = (touch1.clientX + touch2.clientX) / 2;
    const y = (touch1.clientY + touch2.clientY) / 2;
    const rect = element.getBoundingClientRect();
    return {
      x: ((x - rect.left) / rect.width) * viewBox.width + viewBox.x,
      y: ((y - rect.top) / rect.height) * viewBox.height + viewBox.y,
    };
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!svgRef.current) return;

    if (e.touches.length === 1) {
      isTouchPanning.current = true;
      startPoint.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2) {
      lastTouchDistance.current = getDistance(e.touches[0], e.touches[1]);
      lastTouchCenter.current = getCenter(
        e.touches[0],
        e.touches[1],
        svgRef.current
      );
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!svgRef.current) return;

    if (e.touches.length === 1 && isTouchPanning.current) {
      const dx =
        (e.touches[0].clientX - startPoint.current.x) *
        (viewBox.width / svgRef.current.clientWidth);
      const dy =
        (e.touches[0].clientY - startPoint.current.y) *
        (viewBox.height / svgRef.current.clientHeight);

      setViewBox((prev) => ({
        ...prev,
        x: prev.x - dx,
        y: prev.y - dy,
      }));

      startPoint.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const currentCenter = getCenter(
        e.touches[0],
        e.touches[1],
        svgRef.current
      );

      if (lastTouchDistance.current && lastTouchCenter.current) {
        const zoomFactor = lastTouchDistance.current / currentDistance;

        setViewBox((prev) => {
          const newWidth = prev.width * zoomFactor;
          const newHeight = prev.height * zoomFactor;

          return {
            width: newWidth,
            height: newHeight,
            x: currentCenter.x - newWidth / 2,
            y: currentCenter.y - newHeight / 2,
          };
        });
      }

      lastTouchDistance.current = currentDistance;
      lastTouchCenter.current = currentCenter;
    }
  };

  const handleTouchEnd = () => {
    isTouchPanning.current = false;
    lastTouchDistance.current = null;
    lastTouchCenter.current = null;
  };
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const [, forceUpdate] = useState(0);
  const [viewBox, setViewBox] = useState({
    x: params.x,
    y: params.y,
    width: params.width,
    height: params.height,
  });
  const [debouncedViewBox, setDebouncedViewBox] = useState(viewBox);
  useDebounce(
    () => {
      setDebouncedViewBox(viewBox);
    },
    300,
    [viewBox]
  );
  const svgRef = useRef<SVGSVGElement | null>(null);

  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isPanning.current = true;
    startPoint.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const svgX =
      ((e.clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    const svgY =
      ((e.clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;
    mousePosRef.current = { x: svgX, y: svgY };
    forceUpdate((v) => v + 1); // forces a trivial rerender for the small overlay

    if (!isPanning.current) return;

    const dx =
      (e.clientX - startPoint.current.x) *
      (viewBox.width / svgRef.current.clientWidth);
    const dy =
      (e.clientY - startPoint.current.y) *
      (viewBox.height / svgRef.current.clientHeight);

    setViewBox((prev) => {
      if (!moveable) return viewBox;
      let newX = prev.x - dx;
      let newY = prev.y - dy;

      let maxX = maxWidth / 2;
      let minX = (maxWidth / 2) * -1;
      let maxY = maxWidth / 2;
      let minY = (maxWidth / 2) * -1;

      newX = Math.max(minX, Math.min(maxX - prev.width, newX));
      newY = Math.max(minY, Math.min(maxY - prev.height, newY));

      return {
        ...prev,
        x: newX,
        y: newY,
      };
    });

    startPoint.current = { x: e.clientX, y: e.clientY };
  };
  const endPan = () => {
    isPanning.current = false;
    mousePosRef.current = null;
  };
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;

    setViewBox(
      (prev: { x: number; y: number; width: number; height: number }) => {
        const centerX = prev.x + prev.width / 2;
        const centerY = prev.y + prev.height / 2;

        const newWidth = prev.width * zoomFactor;
        const newHeight = prev.height * zoomFactor;
        if (newWidth > maxWidth || newHeight < minWidth) {
          return prev; // Prevent zooming out too much
        }
        return {
          width: newWidth,
          height: newHeight,
          x: centerX - newWidth / 2,
          y: centerY - newHeight / 2,
        };
      }
    );
  };

  useEffect(() => {
    updateViewBox(); // ← call it once right away
    window.addEventListener("resize", updateViewBox);
    return () => window.removeEventListener("resize", updateViewBox);
  }, [updateViewBox]);

  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) return;

    svg.addEventListener("wheel", handleWheel, { passive: false });
    svg.addEventListener("touchstart", handleTouchStart, { passive: false });
    svg.addEventListener("touchmove", handleTouchMove, { passive: false });
    svg.addEventListener("touchend", handleTouchEnd);

    return () => {
      svg.removeEventListener("wheel", handleWheel);
      svg.removeEventListener("touchstart", handleTouchStart);
      svg.removeEventListener("touchmove", handleTouchMove);
      svg.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const getStrokeWidth = (viewBox: ViewBox): number => {
    return viewBox.width / 1000;
  };
  const strokeWidth = getStrokeWidth(viewBox);

  const grid = generateGrid(viewBox);
  return (
    <div className="svg-section">
      <svg
        ref={svgRef}
        className="library-svg"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endPan}
        onMouseLeave={endPan}
      >
        <rect
          x={viewBox.x}
          y={viewBox.y}
          width={viewBox.width}
          height={viewBox.height}
        />
    {displayGrid && (
      <g>
        <g className="helpingLines" strokeWidth={strokeWidth}>
          {grid.vertical.map((x) => (
            <line
              key={`v-${x}`}
              x1={x}
              y1={viewBox.y}
              x2={x}
              y2={viewBox.y + viewBox.height}
            />
          ))}
          {grid.horizontal.map((y) => (
            <line
              key={`h-${y}`}
              y1={y}
              x1={viewBox.x}
              y2={y}
              x2={viewBox.x + viewBox.width}
            />
          ))}
        </g>
        <g className="axes" strokeWidth={strokeWidth}>
          <line
            x1={viewBox.x}
            y1={0}
            x2={viewBox.x + viewBox.width}
            y2={0}
            strokeWidth={strokeWidth}
          />
          <line
            x1={0}
            y1={viewBox.y}
            x2={0}
            y2={viewBox.y + viewBox.height}
            strokeWidth={strokeWidth}
          />
        </g>
        <g
          className="axis-labels"
          fontSize={0.5 * (viewBox.width / 30)}
          textAnchor="middle"
        >
          {grid.labels.map((label, i) => (
            <text
              key={`label-${i}`}
              x={label.x}
              y={label.y}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {label.text}
            </text>
          ))}
        </g>
      </g>
    )}
       

       

     

        <g fill="none" stroke="black" strokeWidth={strokeWidth * 3}>
          {viewBox === debouncedViewBox ? (
            <Picker expressions={expressions} params={viewBox} />
          ) : null}
        </g>
      </svg>
      {viewBox !== debouncedViewBox && (
        <div className="svg-overlay">
          <span>Calculating...</span>
        </div>
      )}
      {mousePosRef.current && displayCoords && (
        <div className="mouse-coords">
          x: {mousePosRef.current.x.toFixed(2)}, y:{" "}
          {mousePosRef.current.y.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default LibraryController;
