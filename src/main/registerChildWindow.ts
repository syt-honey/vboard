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

            // @TODO: need to specify the window using an unique id
            setTimeout(() => {
                if (['count', 'camera'].indexOf(window.getTitle()) > -1) {
                    window.setIgnoreMouseEvents(true)
                    window.setAlwaysOnTop(true, 'pop-up-menu')
                    window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })
                }
            })
        })

        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                ...electronWindowOptions,
                webPreferences: {
                    nodeIntegration: true,
                    sandbox: false,
                    backgroundThrottling: false
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

// Just listen `position`, `size` and `MinimumSize` currently
// If you want to listen other properties you should add them manually.
// Warning: This operation has performance issues, and too many changes can result in too much IPC and rendering overhead
const applyWindowOptions = (title, newOptions: Electron.BrowserWindowConstructorOptions): void => {
    const childWindow = getWindow(title)

    if (childWindow) {
        if (
            (newOptions.x && newOptions.x !== childWindow.getPosition()?.[0]) ||
            (newOptions.y && newOptions.y !== childWindow.getPosition()?.[1])
        ) {
            childWindow.setPosition(newOptions.x || 0, newOptions.y || 0)
        }

        if (
            (newOptions.width && newOptions.width !== childWindow.getSize()?.[0]) ||
            (newOptions.height && newOptions.height !== childWindow.getSize()?.[1])
        ) {
            childWindow.setSize(newOptions.width || 0, newOptions.height || 0)
        }

        if (
            (newOptions.minHeight && newOptions.minHeight !== childWindow.getMinimumSize()?.[0]) ||
            (newOptions.minWidth && newOptions.minWidth !== childWindow.getMinimumSize()?.[1])
        ) {
            childWindow.setMinimumSize(newOptions.minWidth || 0, newOptions.minHeight || 0)
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
