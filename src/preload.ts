import { contextBridge, Rectangle, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronBridge", {
  // takeScreenshot,
  invokeTakeScreenshot: (cropArea: Rectangle) =>
    ipcRenderer.invoke("take-screenshot", cropArea)
});
