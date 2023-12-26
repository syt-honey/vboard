import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import {
    registerMainWindowMainIPCHandler,
    registerBoardWindowMainIPCHandler,
    registerBoardToolWindowMainIPCHandler,
    registerRecordingWindowMainIPCHandler,
    registerGetScreenPrimaryDisplayMainIPCHandler,
    registerGetScreenMainIPCHandler,
    registerSaveFileMainIPCHandler,
    registerGetDevicesPermissionMainIPCHandler,
    registerRequestDevicesPermissionMainIPCHandler,
    registerConfirmDialogMainIPCHandler
} from './ipc'

app.whenReady().then(() => {
    app.setName('vboard')
    electronApp.setAppUserModelId('com.vboard.app')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    app.on('window-all-closed', () => {
        app.quit()
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) registerMainWindowMainIPCHandler()
    })
})

app.once('ready', () => {
    registerMainWindowMainIPCHandler()
    registerRecordingWindowMainIPCHandler()
    registerBoardWindowMainIPCHandler()
    registerBoardToolWindowMainIPCHandler()

    registerGetScreenPrimaryDisplayMainIPCHandler()
    registerGetScreenMainIPCHandler()
    registerSaveFileMainIPCHandler()
    registerGetDevicesPermissionMainIPCHandler()
    registerRequestDevicesPermissionMainIPCHandler()
    registerConfirmDialogMainIPCHandler()
})
// @TODO:
// 1. need to set cameraWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })
// always on top, above the Dock(macOS) and the taskbar(Windows)
// 2. counterWindow.setAlwaysOnTop(true, 'pop-up-menu')
// always show on all workspaces
// 3. counterWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })
// set the window size to the full screen size
// 4. counterWindow.setSize(width, height - y)
