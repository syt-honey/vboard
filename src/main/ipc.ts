import fs from 'fs'
import {
    screen,
    shell,
    desktopCapturer,
    dialog,
    ipcMain,
    systemPreferences,
    BrowserWindow
} from 'electron'

import { createWindow, WindowType } from './utils'
import { systemPreferencesShell, runtime } from './script'
import { registerWindowHandler } from './registerChildWindow'

export const registerMainWindowMainIPCHandler = (): void => {
    let mainWindow: BrowserWindow | null = null
    mainWindow = createWindow({
        width: 380,
        height: 470
    })

    mainWindow.setFullScreenable(false)

    mainWindow.on('close', () => {
        BrowserWindow.getAllWindows().forEach((window) => window.destroy())
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow!.show()
    })

    mainWindow.webContents.setWindowOpenHandler(({ features }) => {
        return registerWindowHandler(features)
    })

    mainWindow.loadURL(runtime.baseUrl())

    // register showMainWindow&minimizeMainWindow handler
    ipcMain.on('showMainWindow', () => {
        mainWindow!.show()
    })

    ipcMain.on('minimizeMainWindow', () => {
        mainWindow!.minimize()
    })
}

export const registerRecordingWindowMainIPCHandler = (): void => {
    let recordingWindow: BrowserWindow | null = null

    ipcMain.on('createRecordingWindow', (_, { url }) => {
        if (recordingWindow) return

        const primaryDisplay = screen.getPrimaryDisplay()
        const { height } = primaryDisplay.workAreaSize
        recordingWindow = createWindow({
            x: 10,
            y: height / 2 - 130,
            width: 68,
            height: 250,
            frame: false,
            alwaysOnTop: true,
            transparent: true,
            resizable: false,
            title: WindowType.RECORDING,
            url: runtime.baseUrl() + url
        })

        recordingWindow.webContents.setWindowOpenHandler(({ features }) => {
            return registerWindowHandler(features)
        })

        recordingWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })
    })

    // register closeRecordingWindow handler
    ipcMain.on('closeRecordingWindow', () => {
        recordingWindow?.close()
        recordingWindow = null
    })
}

export const registerWindowOptionsChangesMainIPCHandler = (title, callback): void => {
    ipcMain.on('windowOptionsChanges', (_, { title: id, newOptions }) => {
        if (id === title) {
            callback(newOptions)
        }
    })
}

export const registerGetScreenPrimaryDisplayMainIPCHandler = (): void => {
    ipcMain.handle('getScreenPrimaryDisplay', () => {
        const { size, workArea, workAreaSize } = screen.getPrimaryDisplay()
        return {
            size,
            workAreaSize,
            workArea
        }
    })
}

export const registerGetScreenMainIPCHandler = (): void => {
    ipcMain.handle('getScreen', () => {
        return desktopCapturer.getSources({
            types: ['window', 'screen'],
            thumbnailSize: {
                height: 300,
                width: 300
            },
            fetchWindowIcons: true
        })
    })
}

// @TODO: there is a max size 2GB limit of blob.
export const registerSaveFileMainIPCHandler = (): void => {
    ipcMain.handle('saveFile', async (_, { arrayBuffer, name }): Promise<boolean> => {
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
}

// get the audio/video/screen permissions
export const registerGetDevicesPermissionMainIPCHandler = (): void => {
    ipcMain.handle('getDevicesPermission', async (_, { mediaType }): Promise<boolean> => {
        return systemPreferences.getMediaAccessStatus(mediaType) === 'granted'
    })
}

// access to the audio&video permissions (only needed in macOS)
export const registerRequestDevicesPermissionMainIPCHandler = (): void => {
    ipcMain.handle('requestDevicesPermission', async (_, { mediaType }): Promise<boolean> => {
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
}

export const registerConfirmDialogMainIPCHandler = (): void => {
    ipcMain.handle('confirmDialog', async (_, options: Partial<Electron.MessageBoxOptions>) => {
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
