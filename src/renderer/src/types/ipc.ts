import { MediaType } from './device'

export type AppActionSync = {
    getWindowBounds: (args: { title: string }) => Electron.Rectangle | undefined
    getScreenPrimaryDisplay: () => Promise<
        Pick<Electron.Display, 'size' | 'workArea' | 'workAreaSize'>
    >
    getScreen: () => Promise<Electron.DesktopCapturerSource[]>
    saveFile: (args: { arrayBuffer: ArrayBuffer; name: string }) => Promise<boolean>
    confirmDialog: (options: Partial<Electron.MessageBoxOptions>) => Promise<number>
    getDevicesPermission: (args: { mediaType: MediaType }) => Promise<boolean>
    requestDevicesPermission: (args: { mediaType: MediaType }) => Promise<boolean>
}
