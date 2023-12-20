import { app } from 'electron'
import { registerWindowOptionsChangesMainIPCHandler } from './ipc'
import { WindowType, getWindow, isWindowType, windowExists } from './utils'

/**
 * This registration was used by `win.webContents.setWindowOpenHandler`
 * which is invoked by `window.open()` in renderer process.
 */

export interface WindowHandlerResponse {
    action: 'allow' | 'deny'
    overrideBrowserWindowOptions?: Electron.BrowserWindowConstructorOptions
    outlivesOpener?: boolean
}

export const registerWindowHandler = (features: string): WindowHandlerResponse => {
    const { electronWindowOptions, windowType } = parseWindowFeatures(features)

    // Only the specified type is allowed to create a window
    if (isWindowType(windowType)) {
        // If the given title has existed, we return `action: deny`
        // It means we can not create two same title windows
        if (electronWindowOptions.title && windowExists(electronWindowOptions.title)) {
            return { action: 'deny' }
        }

        app.once('browser-window-created', (_, window) => {
            if (electronWindowOptions.title) {
                initNewChildWindow(electronWindowOptions.title)
            }

            // @TODO: need to specify the `tooltip` using an unique id
            setTimeout(() => {
                if (window.getTitle() === 'tooltip') {
                    // ensure tooltip is higher than recording window
                    window.setAlwaysOnTop(true, 'pop-up-menu', 3)
                }
            })
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
}

const initNewChildWindow = (title: string): void => {
    registerWindowOptionsChangesMainIPCHandler(title, (newOptions) => {
        applyWindowOptions(title, newOptions)
    })
}

// Just listen `position` and `size` currently
// If you want to listen other properties you should add them manually.
// Warning: This operation has performance issues, and too many changes can result in too much IPC and rendering overhead
const applyWindowOptions = (title, newOptions): void => {
    const childWindow = getWindow(title)

    if (childWindow) {
        if (
            (newOptions.x && newOptions.x !== childWindow.getPosition()?.[0]) ||
            (newOptions.y && newOptions.y !== childWindow.getPosition()?.[1])
        ) {
            childWindow.setPosition(newOptions.x, newOptions.y)
        }

        if (
            (newOptions.width && newOptions.width !== childWindow.getSize()?.[0]) ||
            (newOptions.height && newOptions.height !== childWindow.getSize()?.[1])
        ) {
            childWindow.setSize(newOptions.width, newOptions.height)
        }
    }
}

const parseWindowFeatures = (
    features: string
): {
    electronWindowOptions: Electron.BrowserWindowConstructorOptions
    windowType: WindowType
} => {
    const { windowType, options } = JSON.parse(new URLSearchParams(features).get('config') || '{}')

    return { electronWindowOptions: options, windowType }
}
