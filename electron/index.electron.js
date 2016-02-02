// control application life
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

// quit when all windows are closed
app.on("window-all-closed", function() {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// Electron is ready and can create browser windows
app.on("ready", function() {
	mainWindow =  new BrowserWindow({width: 800, height: 600});
	mainWindow.loadURL("file://" + __dirname + "/../web/index.html");
	mainWindow.webContents.openDevTools();

	mainWindow.on("closed", function() {
		mainWindow = null;
	});
});
