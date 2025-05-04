import React from "react";

type DownloadButtonProps = {
  SvgId: string;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({ SvgId }) => {
    const downloadSVG = () => {
        const svgElement = document.getElementById(SvgId);
        if (!svgElement) {
          console.error("SVG element not found.");
          return;
        }
      
        // Deep clone the SVG
        const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
      
        // Inline computed styles into the clone
        const allElements = clonedSvg.querySelectorAll("*");
        allElements.forEach((el, i) => {
          const originalEl = svgElement.querySelectorAll("*")[i];
          if (!originalEl) return;
      
          const computedStyle = getComputedStyle(originalEl as Element);
          const style = (el as HTMLElement).style;
      
          style.fill = computedStyle.fill;
          style.stroke = computedStyle.stroke;
          style.fontFamily = computedStyle.fontFamily;
          style.fontSize = computedStyle.fontSize;
        });
      
        // Serialize cloned SVG
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(clonedSvg);
      
        // Create Blob and trigger download
        const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
      
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "Graph.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      };
   
   
    return (
        <button
        className="download-button"
        onClick={downloadSVG}
        >
        Download SVG
        </button>
    );
}

export default DownloadButton;