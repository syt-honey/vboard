import { ipcSyncByApp } from '../utils/ipc'

export class Media {
    private _mediaList: Electron.DesktopCapturerSource[] = []

    public async initMedia(): Promise<Electron.DesktopCapturerSource> {
        return await ipcSyncByApp('get-media').then((sources) => {
            this._mediaList = sources
            return this.getMedia()
        })
    }

    public getMedia(): Electron.DesktopCapturerSource {
        return (
            this._mediaList.find((source) => source.name === 'Entire Screen') || this._mediaList[0]
        )
    }
}

export const mediaStore = new Media()
