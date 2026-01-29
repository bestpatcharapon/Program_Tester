const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const path = require('path')

let mainWindow
let tray

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    frame: false, // Frameless window for modern look
    transparent: false,
    backgroundColor: '#0a0e1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/icon.png')
  })

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Window controls
  ipcMain.on('window-minimize', () => {
    mainWindow.minimize()
  })

  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('window-close', () => {
    mainWindow.close()
  })
}

const createTray = () => {
  tray = new Tray(path.join(__dirname, '../public/icon.png'))
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show AutoTest Center',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: 'Run Tests',
      submenu: [
        { label: 'Robot Framework', click: () => console.log('Run Robot') },
        { label: 'Playwright', click: () => console.log('Run Playwright') },
        { label: 'Pytest', click: () => console.log('Run Pytest') }
      ]
    },
    { type: 'separator' },
    {
      label: 'Environment',
      submenu: [
        { label: 'Development', type: 'radio', checked: true },
        { label: 'UAT', type: 'radio' },
        { label: 'Production', type: 'radio' }
      ]
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setToolTip('AutoTest Center')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    mainWindow.show()
  })
}

app.whenReady().then(() => {
  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers for test execution
ipcMain.handle('run-tests', async (event, config) => {
  // Implement test execution logic
  return { success: true, message: 'Tests started' }
})

ipcMain.handle('get-evidence', async () => {
  // Implement evidence retrieval
  return []
})
