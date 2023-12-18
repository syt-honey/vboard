import * as ipc from '../types/ipc'

export const ipcSyncByApp = <
    T extends keyof ipc.AppActionSync,
    U extends Parameters<ipc.AppActionSync[T]>[0]
>(
    action: T,
    args?: U
): ReturnType<ipc.AppActionSync[T]> => {
    return window.electron.ipcRenderer.invoke(action, args) as ReturnType<ipc.AppActionSync[T]>
}

export const ipcCreateRecordingWindow = ({ url }: { url: string }): void => {
    return window.electron.ipcRenderer.send('createRecordingWindow', { url })
}

export const ipcCloseRecordingWindow = (): void => {
    return window.electron.ipcRenderer.send('closeRecordingWindow')
}

export const ipcHideMainWindow = (): void => {
    return window.electron.ipcRenderer.send('minimizeMainWindow')
}

export const ipcShowMainWindow = (): void => {
    return window.electron.ipcRenderer.send('showMainWindow')
}

export const ipcWindowOptionsChanges = (title, newOptions): void => {
    return window.electron.ipcRenderer.send('windowOptionsChanges', { title, newOptions })
}
