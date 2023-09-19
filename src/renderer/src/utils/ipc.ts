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

export const ipcCreateSubWindow = ({ url }: { url: string }): void => {
    return window.electron.ipcRenderer.send('create-window', { url })
}

export const ipcCloseWindow = (): void => {
    return window.electron.ipcRenderer.send('recording-end')
}

export const ipcHideMainWindow = (): void => {
    return window.electron.ipcRenderer.send('minimize-main-window')
}
