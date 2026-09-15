const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let win;

function createWindow() {
  try {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false
      },
    });

    win.loadFile('index.html');
    
    // Open DevTools automatically for debugging
    win.webContents.openDevTools();

    // Handle window close
    win.on('closed', () => {
      win = null;
    });
  } catch (error) {
    console.error('Error creating window:', error);
  }
}

// This will run once Electron is ready to create the window
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (on macOS, it's typical to keep the app running)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('compressFile', async (event, filePath) => {
  try {
    // Ensure the file path is correctly formatted
    if (!filePath) {
      throw new Error("No file path provided.");
    }

    // Resolve the path to ensure it's absolute
    const absoluteFilePath = path.resolve(filePath);

    // Log the absolute file path for debugging
    console.log("Resolved file path:", absoluteFilePath);

    if (!fs.existsSync(absoluteFilePath)) {
      throw new Error(`File does not exist at ${absoluteFilePath}`);
    }

    // Perform file compression (placeholder for now)
    const originalSize = fs.statSync(absoluteFilePath).size;
    const compressedFilePath = absoluteFilePath + '.compressed'; // Placeholder compression logic

    // Placeholder: Mock compression by copying the file
    fs.copyFileSync(absoluteFilePath, compressedFilePath);

    const compressedSize = fs.statSync(compressedFilePath).size;

    return {
      status: 'done',
      file: absoluteFilePath,
      originalSize,
      compressedSize,
    };
  } catch (error) {
    console.error('Error compressing file:', error);
    return {
      status: 'error',
      error: error.message,
    };
  }
});