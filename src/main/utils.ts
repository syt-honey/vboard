import { BrowserWindow } from 'electron'
import { join } from 'path'

export const winURL =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : `file://${__dirname}/index.html`

export interface IWindow extends Electron.BrowserWindowConstructorOptions {
    url?: string
}

export enum WindowType {
    MAIN,
    CAMERA,
    COUNTER,
    RECORDING
}

export const createWindow = ({
    width,
    height,
    x,
    y,
    url,
    ...restProps
}: IWindow): BrowserWindow => {
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
