import { app, BrowserWindow, desktopCapturer, ipcMain, screen } from "electron";

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

const createWindow = (): void => {
  const screenSize = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: screenSize.height,
    width: screenSize.width,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("take-screenshot", async (event, cropArea) => {
  const screenSize = screen.getPrimaryDisplay().workAreaSize;

  return desktopCapturer
    .getSources({
      types: ["screen"],
      thumbnailSize: screenSize
    })
    .then(sources =>
      // resize is needed b/c of diff between screensize that crop is scaled to and thumbnail image size
      sources[0].thumbnail.resize(screenSize).crop(cropArea).toDataURL()
    );
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

/**
 * 1. figure out how to crop post images
 * 2. figure out how to create the cropping UI
 * 3. crop image from cropping UI

 * w. figure out how to call Dyl's code
 * y. figure out quitting from click / other lifecycle things
 * x. figure out how to send csv format to clipboard
 * z. better cropping ui
 * a. clean up code
 */
