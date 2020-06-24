import { BrowserWindow, screen } from 'electron';
import path from 'path';

export function createWindow (environment: string): Promise<unknown> {
  const { height, width } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    height,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
    width
  });

  if (environment === 'development') {
    win.webContents.openDevTools();

    return win.loadURL('http://0.0.0.0:3000/');
  }

  const mainFilePath = path.resolve(__dirname, 'index.html');

  return win.loadFile(mainFilePath);
}
