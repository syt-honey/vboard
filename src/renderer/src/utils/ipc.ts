import * as ipc from '@renderer/types/ipc'

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

export const ipcCreateBoardWindow = ({ url }: { url: string }): void => {
    return window.electron.ipcRenderer.send('createBoardWindow', { url })
}

export const ipcCloseBoardWindow = (): void => {
    return window.electron.ipcRenderer.send('closeBoardWindow')
}

export const setBoardWindowIgnoreMouseEvents = ({ ignore }: { ignore: boolean }): void => {
    return window.electron.ipcRenderer.send('setBoardWindowIgnoreMouseEvents', { ignore })
}

export const ipcCreateBoardToolWindow = ({ url }: { url: string }): void => {
    return window.electron.ipcRenderer.send('createBoardToolWindow', { url })
}

export const ipcCloseBoardToolWindow = (): void => {
    return window.electron.ipcRenderer.send('closeBoardToolWindow')
}
