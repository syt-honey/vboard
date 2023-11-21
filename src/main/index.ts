import {
    app,
    shell,
    BrowserWindow,
    desktopCapturer,
    ipcMain,
    dialog,
    screen,
    systemPreferences
} from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import path from 'path'
import fs from 'fs'

import runtime from './script/runtime'
import { createWindow, WindowType } from './utils'
import { systemPreferencesShell } from './script/system'

// manage all windows
const windows = new Map<WindowType, BrowserWindow>()

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    app.setName('vboard')

    createMainWindow()
    createCameraWindow()
    createCounterWindow()
    createRecordingWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})

app.on('will-quit', () => {
    if (windows.size) {
        windows.forEach((w) => {
            w.close()
        })
        windows.clear()
    }
})

app.on('window-all-closed', () => {
    if (runtime.isMac) return

    app.quit()
})

function createMainWindow(): void {
    let mainWindow: BrowserWindow | null = null
    mainWindow = createWindow({
        width: 380,
        height: 470,
        show: false
        // transparent: true,
        // frame: false,
        // resizable: false
    })
    windows.clear()
    windows.set(WindowType.MAIN, mainWindow)

    mainWindow.on('close', () => {
        if (windows.size) {
            // close all related windows
            windows.forEach((w, k) => {
                if (k !== WindowType.MAIN) {
                    w.close()
                }
            })
            windows.clear()
        }
    })

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

    // get the audio/video/screen permissions
    ipcMain.handle('get-devices-permission', async (_, { mediaType }): Promise<boolean> => {
        return systemPreferences.getMediaAccessStatus(mediaType) === 'granted'
    })

    // access to the audio&video permissions (only needed in macOS)
    ipcMain.handle('request-devices-permission', async (_, { mediaType }): Promise<boolean> => {
        try {
            if (mediaType === 'screen') {
                // there is no system API access for screen recording
                // so we open the system preferences instead.
                // see: https://www.electronjs.org/docs/latest/api/system-preferences#systempreferencesaskformediaaccessmediatype-macos
                shell.openExternal(systemPreferencesShell(mediaType))
                return false
            }

            // NOTE: I do not know the `restricted` status means what, so we ignore it first.
            // TODO: we should check the `restricted` status
            if (
                ['not-determined', 'unknown'].indexOf(
                    systemPreferences.getMediaAccessStatus(mediaType)
                ) > -1
            ) {
                // the first time to request the permissions
                return await systemPreferences.askForMediaAccess(mediaType)
            } else {
                // the second time
                const result = await systemPreferences.askForMediaAccess(mediaType)
                if (result === false) {
                    // user denied before, so we should open the system preferences
                    shell.openExternal(systemPreferencesShell(mediaType))
                    return false
                }
                return false
            }
        } catch {
            // not support
            return false
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
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
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
            url: runtime.baseUrl + url
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
            url: runtime.baseUrl + url
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
            url: runtime.baseUrl + url
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
