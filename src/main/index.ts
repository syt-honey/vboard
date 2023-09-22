import { app, shell, BrowserWindow, desktopCapturer, ipcMain, dialog, screen } from 'electron'
import { join } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

const winURL =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : `file://${__dirname}/index.html`

function createMainWindow(): void {
    let mainWindow: BrowserWindow | null = null
    mainWindow = createWindow({ width: 900, height: 670, show: false, autoHideMenuBar: true })

    ipcMain.on('minimize-main-window', () => {
        mainWindow!.minimize()
    })

    ipcMain.handle('get-media', async () => {
        return desktopCapturer.getSources({
            types: ['window', 'screen'],
            thumbnailSize: {
                height: 300,
                width: 300
            },
            fetchWindowIcons: true
        })
    })

    // @TODO: there is a max size 2GB limit of blob.
    ipcMain.handle('save-file', async (_, { stream, name }) => {
        const { filePath } = await dialog.showSaveDialog({ defaultPath: name, title: name })
        if (filePath) {
            fs.writeFile(filePath, stream, (err) => {
                if (err) {
                    console.error(err)
                }
            })
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow!.show()

        // @TODO: we should check the audio&video permissions before using them
        // try {
        //     // prompt for permissions on macOS
        //     const types = ["camera", "microphone", "screen"]
        //     let accessPerms = {}

        //     for (const type of types) {
        //         const status = systemPreferences.getMediaAccessStatus(type as "camera" | "microphone" | "screen")
        //         accessPerms[type] = status
        //     }

        //     console.log(accessPerms)
        //     } catch (e) {
        //     console.error(e)
        // }
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

function createCameraWindow(): void {
    let cameraWindow: BrowserWindow | null = null

    ipcMain.on('create-camera-window', (_, { url }) => {
        if (cameraWindow) {
            return
        }

        const primaryDisplay = screen.getPrimaryDisplay()
        const { height } = primaryDisplay.workAreaSize
        cameraWindow = createWindow({
            x: 0,
            y: height - 200,
            width: 200,
            height: 200,
            frame: false,
            transparent: true,
            resizable: false,
            url: winURL + url
        })
    })

    ipcMain.on('close-camera-window', () => {
        cameraWindow?.close()
        cameraWindow = null
    })
}

function createCounterWindow(): void {
    let counterWindow: BrowserWindow | null = null

    ipcMain.on('create-counter-window', (_, { url }) => {
        if (counterWindow) {
            return
        }

        const primaryDisplay = screen.getPrimaryDisplay()
        const { width, height } = primaryDisplay.workAreaSize
        counterWindow = createWindow({
            x: 0,
            y: 0,
            width,
            height,
            frame: false,
            transparent: true,
            url: winURL + url
        })
    })

    ipcMain.on('close-counter-window', () => {
        counterWindow?.close()
        counterWindow = null
    })
}

function createRecordingWindow(): void {
    let recordingWindow: BrowserWindow | null = null

    ipcMain.on('create-recording-window', (_, { url }) => {
        if (recordingWindow) {
            return
        }

        // @TODO: those width and height shoud be auto
        const primaryDisplay = screen.getPrimaryDisplay()
        const { height } = primaryDisplay.workAreaSize
        recordingWindow = createWindow({
            x: 0,
            y: height / 2 - 50,
            width: 40,
            height: 140,
            frame: false,
            transparent: true,
            resizable: false,
            url: winURL + url
        })
    })

    ipcMain.on('recording-window-resize', (_, { width, height }) => {
        recordingWindow?.setSize(width, height)
    })

    ipcMain.on('close-recording-window', () => {
        recordingWindow?.close()
        recordingWindow = null
    })
}

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    createMainWindow()
    createCameraWindow()
    createCounterWindow()
    createRecordingWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

const createWindow = ({ width, height, x, y, url, ...restProps }: IWindow): BrowserWindow => {
    const options = { width, height } as IWindow

    typeof x === 'number' && (options.x = x)
    typeof y === 'number' && (options.y = y)
    url && (options.url = url)

    const window = new BrowserWindow({
        ...options,
        ...restProps,
        webPreferences: {
            nodeIntegration: true,
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    // if there is url, we will use page component of renderer app to show child window
    if (url) {
        window.loadURL(url)
    }

    return window
}

interface IWindow extends Electron.BrowserWindowConstructorOptions {
    url?: string
}
