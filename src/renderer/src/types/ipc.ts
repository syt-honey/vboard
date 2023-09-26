export type AppActionSync = {
    'get-media': () => Promise<Electron.DesktopCapturerSource[]>
    'save-file': (args: { arrayBuffer: ArrayBuffer; name: string }) => Promise<void>
}
