const {app, BrowserWindow, Menu} = require('electron')
const installExtension = require('electron-devtools-installer').default
const {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function initExtension(){
  // if(process.env.ENV == "development"){
  //   installExtension(REDUX_DEVTOOLS)
  //   .then((name) => {
  //     console.log(`Added Extension:  ${name}`);
  //     installExtension(REACT_DEVELOPER_TOOLS)
  //       .then((name) => {
  //         console.log(`Added Extension:  ${name}`);
  //         createWindow();
  //       })
  //       .catch((err) => console.log('An error occurred: ', err));
  //   })
  //   .catch((err) => console.log('An error occurred: ', err));
  // } else {
    createWindow();
  // }
}

function createWindow () {
  Menu.setApplicationMenu(null);

  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', initExtension)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    initExtension()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.