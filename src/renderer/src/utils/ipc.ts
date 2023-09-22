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

export const ipcCreateCounterWindow = ({ url }: { url: string }): void => {
    return window.electron.ipcRenderer.send('create-counter-window', { url })
}

export const ipcCloseCounterWindow = (): void => {
    return window.electron.ipcRenderer.send('close-counter-window')
}

export const ipcCreateCameraWindow = ({ url }: { url: string }): void => {
    return window.electron.ipcRenderer.send('create-camera-window', { url })
}

export const ipcCloseCameraWindow = (): void => {
    return window.electron.ipcRenderer.send('close-camera-window')
}

export const ipcHideMainWindow = (): void => {
    return window.electron.ipcRenderer.send('minimize-main-window')
}
