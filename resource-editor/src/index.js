'use strict';
import { app, BrowserWindow } from 'electron';
import url from 'url';
import path from 'path';

const windows = [];
function createWindow() {
  const win = new BrowserWindow();
  win.maximize();
  win.loadURL(url.format({
    pathname: path.resolve('index.html'),
    protocol: 'file:',
    slashes: true
  }));
  const ind = windows.push(win) - 1;
  win.on('closed', () => {
    windows.splice(ind, 1);
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if(!windows.length) {
    createWindow();
  }
});
