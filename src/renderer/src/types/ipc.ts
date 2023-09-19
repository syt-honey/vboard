export type AppActionSync = {
    'get-media': () => Promise<Electron.DesktopCapturerSource[]>
    'save-file': (args: { stream: Uint8Array; name: string }) => Promise<void>
}
