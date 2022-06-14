const { app, BrowserWindow } = require('electron')


function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        icon: './build/HRControl.ico',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    // quita menu por defecto de chromium
    mainWindow.setMenu(null);

    mainWindow.loadFile('index.html')

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()
}

app.whenReady().then(createWindow);