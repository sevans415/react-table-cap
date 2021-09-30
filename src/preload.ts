import { contextBridge, desktopCapturer, Rectangle } from "electron";

const takeScreenshot = (
  cropArea: Rectangle,
  callback: (img: string) => void
): void => {
  desktopCapturer
    .getSources({
      types: ["screen"],
      thumbnailSize: { height: 2000, width: 2000 }
    })
    .then(sources => {
      const img = sources[0].thumbnail.crop(cropArea).toDataURL();
      callback(
        img // The image to display the screenshot
      );
    });
};

contextBridge.exposeInMainWorld("electronBridge", {
  takeScreenshot
});
