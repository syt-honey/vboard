import { BrowserWindow } from 'electron'
import runtime from './script/runtime'

export interface IWindow extends Electron.BrowserWindowConstructorOptions {
    url?: string
}

export enum WindowType {
    MAIN = 'MAIN',
    CAMERA = 'CAMERA',
    COUNTER = 'COUNTER',
    RECORDING = 'RECORDING'
}

export const isWindowType = (type: string): boolean =>
    Object.values(WindowType).includes(type as WindowType)

export const windowExists = (windowTitle: string): boolean =>
    BrowserWindow.getAllWindows()?.some((win) => win.getTitle() === windowTitle)

export const getWindow = (windowTitle: string): BrowserWindow | undefined =>
    BrowserWindow.getAllWindows()?.find((win) => win.getTitle() === windowTitle)

export function parseWindowFeatures(features: string): {
    electronWindowOptions: Electron.BrowserWindowConstructorOptions
    windowType: string
} {
    const { windowType, options } = JSON.parse(new URLSearchParams(features).get('config') || '{}')

    return { electronWindowOptions: options, windowType }
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

    const win = new BrowserWindow({
        ...options,
        ...restProps,
        webPreferences: {
            nodeIntegration: true,
            preload: runtime.preloadUrl,
            sandbox: false
        }
    })

    // if there is url, we will use page component of renderer app to show child window
    if (url) {
        win.loadURL(url)
    }

    return win
}
