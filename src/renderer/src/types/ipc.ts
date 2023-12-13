import { MediaType } from './device'

export interface ScreenWorkAreaType {
    workAreaSize: { width: number; height: number }
    workArea: { width: number; height: number }
}

export type AppActionSync = {
    'get-screen-work-area': () => Promise<ScreenWorkAreaType>
    'get-screen': () => Promise<Electron.DesktopCapturerSource[]>
    'save-file': (args: { arrayBuffer: ArrayBuffer; name: string }) => Promise<boolean>
    'confirm-dialog': (options: Partial<Electron.MessageBoxOptions>) => Promise<number>
    'get-devices-permission': (args: { mediaType: MediaType }) => Promise<boolean>
    'request-devices-permission': (args: { mediaType: MediaType }) => Promise<boolean>
}
