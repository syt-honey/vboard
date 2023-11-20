export type AppActionSync = {
    'get-screen': () => Promise<Electron.DesktopCapturerSource[]>
    'save-file': (args: { arrayBuffer: ArrayBuffer; name: string }) => Promise<boolean>
    'confirm-dialog': (options: Partial<Electron.MessageBoxOptions>) => Promise<number>
    'get-devices-permission': (args: {
        mediaType: 'camera' | 'microphone' | 'screen'
    }) => Promise<boolean>
    'request-devices-permission': (args: {
        mediaType: 'camera' | 'microphone' | 'screen'
    }) => Promise<boolean>
}
