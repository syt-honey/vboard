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
import { electronApp, optimizer } from '@electron-toolkit/utils'
import fs from 'fs'

import runtime from './script/runtime'
import {
    WindowType,
    createWindow,
    isWindowType,
    windowExists,
    parseWindowFeatures,
    getWindow
} from './utils'
import { systemPreferencesShell } from './script/system'

// TODO: replace with BrowserWindow.getAllWindows()
// manage all windows
const windows = new Map<WindowType, BrowserWindow>()

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    app.setName('vboard')

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})

app.once('ready', () => {
    createMainWindow()
    createCameraWindow()
    createCounterWindow()
    createRecordingWindow()

    ipcMain.handle('get-screen-work-area', () => {
        const primaryDisplay = screen.getPrimaryDisplay()
        const { width: workAreaSizeWidth, height: workAreaSizeHeight } = primaryDisplay.workAreaSize
        const { width: workAreaWidth, height: workAreaHeight } = primaryDisplay.workArea

        return {
            workAreaSize: {
                width: workAreaSizeWidth,
                height: workAreaSizeHeight
            },
            workArea: {
                width: workAreaWidth,
                height: workAreaHeight
            }
        }
    })

    ipcMain.handle('get-screen', () => {
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
                await shell.openExternal(systemPreferencesShell(mediaType))
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
                    await shell.openExternal(systemPreferencesShell(mediaType))
                    return false
                }
                return false
            }
        } catch {
            // not support
            return false
        }
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
})

app.on('window-all-closed', () => {
    app.quit()
})

function createMainWindow(): void {
    let mainWindow: BrowserWindow | null = null
    mainWindow = createWindow({
        width: 380,
        height: 470
    })
    windows.clear()
    windows.set(WindowType.MAIN, mainWindow)

    mainWindow.setFullScreenable(false)

    mainWindow.on('close', () => {
        BrowserWindow.getAllWindows().forEach((window) => window.destroy())
    })

    ipcMain.on('show-main-window', () => {
        mainWindow!.show()
    })

    ipcMain.on('minimize-main-window', () => {
        mainWindow!.minimize()
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow!.show()
    })

    // Create child window
    mainWindow.webContents.setWindowOpenHandler(({ features }) => {
        const { electronWindowOptions, windowType } = parseWindowFeatures(features)

        // Only the specified type is allowed to create a window
        if (isWindowType(windowType)) {
            // If the given title has existed, we return `action: deny`
            // It means we can not create two same title windows
            if (electronWindowOptions.title && windowExists(electronWindowOptions.title)) {
                return { action: 'deny' }
            }

            app.once('browser-window-created', () => {
                initNewChildWindow(electronWindowOptions.title)
            })

            return {
                action: 'allow',
                overrideBrowserWindowOptions: {
                    ...electronWindowOptions,
                    webPreferences: {
                        nodeIntegration: true,
                        sandbox: false
                    }
                }
            }
        }

        return { action: 'deny' }
    })

    mainWindow.loadURL(runtime.baseUrl())
}

export const listenOptionsChanges = (title, callback): void => {
    ipcMain.on('window-options-changes', (_, { title: id, newOptions }) => {
        console.log('window-options-changes: ', newOptions.x, newOptions.y, id)

        if (id === title) {
            callback(newOptions)
        }
    })
}

const initNewChildWindow = (title): void => {
    listenOptionsChanges(title, (newOptions) => {
        applyWindowOptions(title, newOptions)
    })
}

// Just listen `position` currently
// If you want to listen other properties you should add them manually.
const applyWindowOptions = (title, newOptions): void => {
    const childWindow = getWindow(title)

    if (childWindow) {
        if (
            newOptions.x !== childWindow.getPosition()[0] ||
            newOptions.y !== childWindow.getPosition()[1]
        ) {
            childWindow.setPosition(newOptions.x, newOptions.y)
        }
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
            alwaysOnTop: true,
            transparent: true,
            resizable: false,
            title: WindowType.CAMERA,
            url: runtime.baseUrl() + url
        })

        // set `{ visibleOnFullScreen: true }` will hide dock icon
        // see: https://github.com/electron/electron/issues/26350、https://github.com/electron/electron/pull/25126
        // https://www.electronjs.org/docs/latest/api/browser-window#winsetvisibleonallworkspacesvisible-options-macos-linux
        cameraWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })
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
            width: 68,
            height: 250,
            show: false,
            frame: false,
            alwaysOnTop: true,
            transparent: true,
            resizable: false,
            title: WindowType.RECORDING,
            url: runtime.baseUrl() + url
        })

        recordingWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })
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
            title: WindowType.COUNTER,
            url: runtime.baseUrl() + url
        })

        // always on top, above the Dock(macOS) and the taskbar(Windows)
        counterWindow.setAlwaysOnTop(true, 'pop-up-menu')

        // always show on all workspaces
        counterWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })

        // set the window size to the full screen size
        counterWindow.setSize(width, height - y)

        windows.set(WindowType.COUNTER, counterWindow)
    })

    ipcMain.on('close-counter-window', () => {
        windows.delete(WindowType.COUNTER)
        counterWindow?.close()
        counterWindow = null

        if (windows.has(WindowType.RECORDING)) {
            windows.get(WindowType.RECORDING)?.show()
        }
    })
}
