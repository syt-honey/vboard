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

export const registerBoardWindowMainIPCHandler = (): void => {
    let boardWindow: BrowserWindow | null = null

    ipcMain.on('createBoardWindow', (e, { url }) => {
        if (!validateSender(e.senderFrame)) return
        if (boardWindow || !url) return

        const { size } = screen.getPrimaryDisplay()
        boardWindow = createWindow({
            x: 0,
            y: 0,
            width: size.width,
            // @TODO: why should need to minus 30
            height: size.height - 30,
            frame: false,
            alwaysOnTop: true,
            transparent: true,
            resizable: false,
            title: WindowType.BOARD,
            url: runtime.baseUrl() + url
        })

        boardWindow.webContents.setWindowOpenHandler(({ features }) => {
            return registerWindowHandler(features)
        })

        boardWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })

        boardWindow.setAlwaysOnTop(true, 'pop-up-menu', 1)
    })

    // register closeBoard Window handler
    ipcMain.on('closeBoardWindow', (e) => {
        if (!validateSender(e.senderFrame)) return

        boardWindow?.close()
        boardWindow = null
    })
}

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
    ipcMain.on('showMainWindow', (e) => {
        if (!validateSender(e.senderFrame)) return
        mainWindow!.show()
    })

    ipcMain.on('minimizeMainWindow', (e) => {
        if (!validateSender(e.senderFrame)) return
        mainWindow!.minimize()
    })
}

export const registerRecordingWindowMainIPCHandler = (): void => {
    let recordingWindow: BrowserWindow | null = null

    ipcMain.on('createRecordingWindow', (e, { url }) => {
        if (!validateSender(e.senderFrame)) return
        if (recordingWindow || !url) return

        const primaryDisplay = screen.getPrimaryDisplay()
        const { height } = primaryDisplay.workAreaSize
        recordingWindow = createWindow({
            x: 0,
            y: height / 2 - 130,
            width: 68,
            height: 300,
            frame: false,
            alwaysOnTop: true,
            transparent: true,
            resizable: false,
            title: WindowType.RECORDING,
            url: runtime.baseUrl() + url
        })

        // We need to set the `x` again to fix the bug that window was positioned in the center of Desktop in silicon macOS.
        recordingWindow.setBounds({
            x: 10
        })

        recordingWindow.webContents.setWindowOpenHandler(({ features }) => {
            return registerWindowHandler(features)
        })

        recordingWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })

        // make recording window higher than other window
        recordingWindow.setAlwaysOnTop(true, 'pop-up-menu', 2)
    })

    // register closeRecordingWindow handler
    ipcMain.on('closeRecordingWindow', (e) => {
        if (!validateSender(e.senderFrame)) return

        recordingWindow?.close()
        recordingWindow = null
    })
}

export const registerWindowOptionsChangesMainIPCHandler = (title, callback): void => {
    ipcMain.on('windowOptionsChanges', (e, { title: id, newOptions }) => {
        if (!validateSender(e.senderFrame)) return

        if (id === title) {
            callback(newOptions)
        }
    })
}

export const registerGetScreenPrimaryDisplayMainIPCHandler = (): void => {
    ipcMain.handle('getScreenPrimaryDisplay', (e) => {
        if (!validateSender(e.senderFrame)) return

        const { size, workArea, workAreaSize } = screen.getPrimaryDisplay()
        return {
            size,
            workAreaSize,
            workArea
        }
    })
}

export const registerGetScreenMainIPCHandler = (): void => {
    ipcMain.handle('getScreen', (e) => {
        if (!validateSender(e.senderFrame)) return

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
    ipcMain.handle('saveFile', async (e, { arrayBuffer, name }): Promise<boolean> => {
        if (!validateSender(e.senderFrame)) return false

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
    ipcMain.handle('getDevicesPermission', async (e, { mediaType }): Promise<boolean> => {
        if (!validateSender(e.senderFrame)) return false

        return systemPreferences.getMediaAccessStatus(mediaType) === 'granted'
    })
}

// access to the audio&video permissions (only needed in macOS)
export const registerRequestDevicesPermissionMainIPCHandler = (): void => {
    ipcMain.handle('requestDevicesPermission', async (e, { mediaType }): Promise<boolean> => {
        if (!validateSender(e.senderFrame)) return false

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
    ipcMain.handle('confirmDialog', async (e, options: Partial<Electron.MessageBoxOptions>) => {
        if (!validateSender(e.senderFrame)) return

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

const validateSender = (frame: Electron.WebFrameMain): boolean => {
    // Value the host of the URL using an actual URL parser and an allowlist
    const host = new URL(frame.url).host
    if (['localhost:5173'].indexOf(new URL(frame.url).host) > -1 || !host) return true
    return false
}
