import React, { useState, MouseEvent } from "react";

const tempCropArea = {
  x: 0,
  y: 0,
  width: 2000,
  height: 2000
};

interface Point {
  x: number;
  y: number;
}

const takeScreenshotAndPreview = () => {
  // @ts-ignore
  window.electronBridge.takeScreenshot(
    tempCropArea,
    // @ts-ignore
    base64data => {
      // Draw image in the img tag
      document.getElementById("my-preview").setAttribute("src", base64data);
    },
    "image/png"
  );
};

const App = () => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [currMousePosition, setCurrMousePosition] =
    useState<null | Point>(null);
  const [downMousePosition, setDownMousePosition] =
    useState<null | Point>(null);

  const mouseDown = (e: MouseEvent) => {
    setDownMousePosition({ x: e.clientX, y: e.clientY });
    setIsMouseDown(true);
    console.log(e);
    console.log("DOWN:", { x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const mouseUp = (e: MouseEvent) => {
    // console.log(e);
    console.log("up:", { x: e.clientX, y: e.clientY });
    setIsMouseDown(false);
    setCurrMousePosition(null);
    setDownMousePosition(null);
    takeScreenshotAndPreview();
    console.log("MOUSE UP");
    console.log("down ", downMousePosition, "\n up: ", currMousePosition);
  };

  const mouseMove = (e: MouseEvent) => {
    if (isMouseDown) {
      setCurrMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const insideScreenshotStyles =
    downMousePosition && currMousePosition
      ? {
          // TODO: need to adjust for if they go right -> left, or down -> up
          top: downMousePosition.y,
          left: downMousePosition.x,
          width: Math.abs(currMousePosition.x - downMousePosition.x),
          height: Math.abs(currMousePosition.y - downMousePosition.y)
        }
      : null;

  return (
    <div
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      onMouseMove={isMouseDown ? mouseMove : undefined}
      className="app-body outside-screenshot"
    >
      {downMousePosition && currMousePosition && (
        <div className="inside-screenshot" style={insideScreenshotStyles}></div>
      )}

      <img id="my-preview" style={{ width: "90%" }} />
    </div>
  );
};

export default App;
