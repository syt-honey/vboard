import { app, shell, BrowserWindow, desktopCapturer, ipcMain, dialog, screen } from 'electron'
import { join } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    ipcMain.on('minimize-main-window', () => {
        mainWindow!.minimize()
    })

    let subWindow: BrowserWindow | null = null

    ipcMain.on('create-window', () => {
        // @TODO: this area is incorrect.
        // We expect the window width and height to be the same as the full screen width and height, including nav and dock height.
        // But the maxHeight of this window seemingly not includes nav and dock height.
        const primaryDisplay = screen.getPrimaryDisplay()
        const { width, height } = primaryDisplay.workAreaSize
        subWindow = new BrowserWindow({
            x: 0,
            y: 0,
            parent: mainWindow!,
            modal: true,
            width,
            height,
            frame: false,
            transparent: true,
            webPreferences: { nodeIntegration: true }
        })

        // @TODO: there are two ways to load html file.
        // the one is use path which is a page component of renderer app, and the other one is use preload.
        // See: https://electron-vite.org/guide/dev.html#multiple-windows-app
        // subWindow.loadFile(join(__dirname, '../renderer/recording.html'))
    })

    ipcMain.on('recording-end', () => {
        console.log('recording-end')
        subWindow!.close()
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

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
