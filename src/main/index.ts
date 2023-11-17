import { app, shell, BrowserWindow, desktopCapturer, ipcMain, dialog, screen } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { join } from 'path'
import fs from 'fs'

import { createWindow, WindowType, winURL } from './utils'

// manage all windows
const windows = new Map<WindowType, BrowserWindow>()

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

function createMainWindow(): void {
    let mainWindow: BrowserWindow | null = null
    mainWindow = createWindow({
        width: 300,
        height: 370,
        show: false
        // transparent: true,
        // frame: false,
        // resizable: false
    })
    windows.clear()
    windows.set(WindowType.MAIN, mainWindow)

    ipcMain.on('show-main-window', () => {
        mainWindow!.show()
    })

    ipcMain.on('minimize-main-window', () => {
        mainWindow!.minimize()
    })

    ipcMain.handle('get-screen', async () => {
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
    ipcMain.handle('save-file', async (_, { arrayBuffer, name }): Promise<boolean> => {
        const stream = Buffer.from(arrayBuffer)
        const { canceled, filePath } = await dialog.showSaveDialog({
            defaultPath: name,
            title: name
        })

        if (canceled) return false

        let result = true

        if (filePath) {
            fs.writeFile(filePath, stream, (err) => {
                result = false

                if (err) {
                    console.error(err)
                }
            })
        }

        return result
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

    ipcMain.on('create-camera-window', (_, { url, isDelay }) => {
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
            show: !isDelay,
            transparent: true,
            resizable: false,
            url: winURL + url
        })

        cameraWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
        windows.set(WindowType.CAMERA, cameraWindow)
    })

    ipcMain.on('close-camera-window', () => {
        windows.delete(WindowType.CAMERA)
        cameraWindow?.close()
        cameraWindow = null
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
            y: height / 2 - 130,
            width: 60,
            height: 250,
            show: false,
            frame: false,
            alwaysOnTop: true,
            transparent: true,
            resizable: false,
            url: winURL + url
        })

        recordingWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
        windows.set(WindowType.RECORDING, recordingWindow)
    })

    ipcMain.on('recording-window-resize', (_, { width, height }) => {
        recordingWindow?.setSize(width, height)
    })

    ipcMain.on('close-recording-window', () => {
        recordingWindow?.close()
        recordingWindow = null
        windows.delete(WindowType.RECORDING)
    })

    ipcMain.handle('confirm-dialog', async (_, options: Partial<Electron.MessageBoxOptions>) => {
        const { response } = await dialog.showMessageBox({
            type: 'question',
            defaultId: 0,
            noLink: true,
            title: '确认操作',
            buttons: ['确认', '取消'],
            message: '你确定要执行该操作吗？',
            ...options
        })
        return response === 0
    })
}

function createCounterWindow(): void {
    let counterWindow: BrowserWindow | null = null

    ipcMain.on('create-counter-window', (_, { url }) => {
        if (counterWindow) {
            return
        }

        const primaryDisplay = screen.getPrimaryDisplay()

        const { width, height } = primaryDisplay.size
        const { y } = primaryDisplay.workArea
        counterWindow = createWindow({
            x: 0,
            y: 0,
            width,
            height: height - y,
            minHeight: height - y,
            frame: false,
            transparent: true,
            url: winURL + url
        })

        // always on top, above the Dock(macOS) and the taskbar(Windows)
        counterWindow.setAlwaysOnTop(true, 'pop-up-menu')

        // always show on all workspaces
        counterWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

        // set the window size to the full screen size
        counterWindow.setSize(width, height - y)

        windows.set(WindowType.COUNTER, counterWindow)
    })

    ipcMain.on('close-counter-window', () => {
        windows.delete(WindowType.COUNTER)
        counterWindow?.close()
        counterWindow = null

        if (windows.has(WindowType.CAMERA)) {
            windows.get(WindowType.CAMERA)?.show()
        }

        if (windows.has(WindowType.RECORDING)) {
            windows.get(WindowType.RECORDING)?.show()
        }
    })
}
