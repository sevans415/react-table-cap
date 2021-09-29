import React from "react";

const App = () => {
  const takeScreenshotAndPreview = () => {
    // @ts-ignore
    window.electronBridge.takeScreenshot(base64data => {
      // Draw image in the img tag
      document.getElementById("my-preview").setAttribute("src", base64data);
    }, "image/png");
  };
  return (
    <div>
      <h2>Hello from React!</h2>
      <button id="trigger" onClick={takeScreenshotAndPreview}>
        Take Screenshot
      </button>

      <img id="my-preview" style={{ width: "90%" }} />
    </div>
  );
};

export default App;
