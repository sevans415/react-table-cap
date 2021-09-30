import React, { useState, MouseEvent } from "react";

const tempCropArea = {
  x: 0,
  y: 0,
  width: 2000,
  height: 2000
};

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
    useState<null | { x: number; y: number }>(null);
  const [downMousePosition, setDownMousePosition] =
    useState<null | { x: number; y: number }>(null);

  const mouseDown = (e: MouseEvent) => {
    setDownMousePosition({ x: e.screenX, y: e.screenY });
    setIsMouseDown(true);
    console.log(e);
  };

  const mouseUp = (e: MouseEvent) => {
    console.log(e);
    setIsMouseDown(false);
    takeScreenshotAndPreview();
  };

  const mouseMove = (e: MouseEvent) => {
    setCurrMousePosition({ x: e.screenX, y: e.screenY });
    console.log(e);
  };

  return (
    <div
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      onMouseMove={isMouseDown ? mouseMove : undefined}
      style={{ width: "100vw", height: "100vh" }}
    >
      <h2>Hello from React!</h2>
      <button id="trigger" onClick={takeScreenshotAndPreview}>
        Take Screenshot
      </button>

      <img id="my-preview" style={{ width: "90%" }} />
    </div>
  );
};

export default App;
