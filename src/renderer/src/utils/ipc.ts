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
    return window.electron.ipcRenderer.send('create-recording-window', { url })
}

export const ipcCloseRecordingWindow = (): void => {
    return window.electron.ipcRenderer.send('close-recording-window')
}

export const ipcHideMainWindow = (): void => {
    return window.electron.ipcRenderer.send('minimize-main-window')
}

export const ipcShowMainWindow = (): void => {
    return window.electron.ipcRenderer.send('show-main-window')
}

export const ipcWindowOptionsChanges = (title, newOptions): void => {
    return window.electron.ipcRenderer.send('window-options-changes', { title, newOptions })
}
