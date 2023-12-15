import { MediaType } from './device'

export type AppActionSync = {
    'get-screen-primary-display': () => Promise<
        Pick<Electron.Display, 'size' | 'workArea' | 'workAreaSize'>
    >
    'get-screen': () => Promise<Electron.DesktopCapturerSource[]>
    'save-file': (args: { arrayBuffer: ArrayBuffer; name: string }) => Promise<boolean>
    'confirm-dialog': (options: Partial<Electron.MessageBoxOptions>) => Promise<number>
    'get-devices-permission': (args: { mediaType: MediaType }) => Promise<boolean>
    'request-devices-permission': (args: { mediaType: MediaType }) => Promise<boolean>
}
