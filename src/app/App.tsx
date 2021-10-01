import { Rectangle } from "electron";
import React, { useState, MouseEvent } from "react";

interface Point {
  x: number;
  y: number;
}

const takeScreenshotAndPreview = async (cropArea: Rectangle) => {
  // @ts-ignore
  window.electronBridge.invokeTakeScreenshot(cropArea).then(base64data => {
    // Draw image in the img tag
    document
      .getElementsByClassName("img-preview")[0]
      .setAttribute("src", base64data);
  });
};

const TEMP_Y_ADJUSTER = -5;

const getRectDimensions = (
  pt1: Point,
  pt2: Point,
  adjust: Point = { x: 0, y: 0 }
): Rectangle => ({
  x: Math.min(pt1.x, pt2.x) + adjust.x,
  y: Math.min(pt1.y, pt2.y) + adjust.y,
  width: Math.abs(pt1.x - pt2.x),
  height: Math.abs(pt1.y - pt2.y)
});

const App = () => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [currMousePosition, setCurrMousePosition] =
    useState<null | Point>(null);
  const [downMousePosition, setDownMousePosition] =
    useState<null | Point>(null);
  const [screenDimensionDiff, setScreenDimensionDiff] =
    useState<null | Point>(null);

  const mouseDown = (e: MouseEvent) => {
    const { clientX, clientY, screenX, screenY } = e;
    setScreenDimensionDiff({ x: screenX - clientX, y: screenY - clientY });
    setDownMousePosition({ x: clientX, y: clientY });
    setIsMouseDown(true);
    console.log(e);
    console.log("DOWN:", { x: clientX, y: clientY });
    e.preventDefault();
  };

  const mouseUp = (e: MouseEvent) => {
    // console.log(e);
    console.log("up:", { x: e.clientX, y: e.clientY });
    takeScreenshotAndPreview(
      getRectDimensions(downMousePosition, currMousePosition, {
        ...screenDimensionDiff,
        y: screenDimensionDiff.y + TEMP_Y_ADJUSTER
      })
    );
    console.log("MOUSE UP");
    console.log("down ", downMousePosition, "\n up: ", currMousePosition);
    setIsMouseDown(false);
    setCurrMousePosition(null);
    setDownMousePosition(null);
  };

  const mouseMove = (e: MouseEvent) => {
    if (isMouseDown) {
      setCurrMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const currentRect =
    downMousePosition && currMousePosition
      ? getRectDimensions(downMousePosition, currMousePosition)
      : null;

  const insideScreenshotStyles = currentRect
    ? {
        ...currentRect,
        top: currentRect.y,
        left: currentRect.x
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

      <img
        className="img-preview"
        style={{ width: "90%", alignContent: "center" }}
      />
    </div>
  );
};

export default App;
