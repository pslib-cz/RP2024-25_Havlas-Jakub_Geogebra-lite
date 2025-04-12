interface ViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  interface GridLine {
    vertical: number[];
    horizontal: number[];
    labels: { x: number; y: number; text: string }[];
  }
  
  const generateGrid = (viewBox: ViewBox): GridLine => {
    const { x, y, width, height } = viewBox;
  
    const targetLines = 10;
    const rawStep = width / targetLines;
  
    // Pick a nice-looking step
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    let step = magnitude;
    if (rawStep / magnitude > 5) step = 5 * magnitude;
    else if (rawStep / magnitude > 2) step = 2 * magnitude;
  
    const vertical: number[] = [];
    const horizontal: number[] = [];
    const labels: GridLine["labels"] = [];
    const precision = getPrecision(viewBox);
    for (let i = Math.ceil(x / step) * step; i <= x + width; i += step) {
      vertical.push(i);
      if (Math.abs(i) > 1e-6) {
        labels.push({ x: i, y: -0.5 * step, text: i.toFixed(precision) });
      }
    }
  
    for (let i = Math.ceil(y / step) * step; i <= y + height; i += step) {
      horizontal.push(i);
      if (Math.abs(i) > 1e-6) {
        labels.push({ x: 0.5 * step, y: i, text: (-i).toFixed(precision) });
      }
    }
  
    return { vertical, horizontal, labels };
  };

  export default generateGrid;

  const getPrecision = (viewBox: ViewBox): number => {
  
    const magnitude = -Math.floor(Math.log10(Math.abs(viewBox.width))); 
    
    
    const precision = Math.floor(magnitude) + 1;  
   
   
    return Math.max(0, Math.min(precision, 7)); 
  };