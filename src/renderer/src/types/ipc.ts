export type AppActionSync = {
    'get-media': () => Promise<Electron.DesktopCapturerSource[]>
    'save-file': (args: { arrayBuffer: ArrayBuffer; name: string }) => Promise<boolean>
    'confirm-dialog': (options: Partial<Electron.MessageBoxOptions>) => Promise<number>
}
