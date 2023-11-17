export type AppActionSync = {
    'get-screen': () => Promise<Electron.DesktopCapturerSource[]>
    'save-file': (args: { arrayBuffer: ArrayBuffer; name: string }) => Promise<boolean>
    'confirm-dialog': (options: Partial<Electron.MessageBoxOptions>) => Promise<number>
}
