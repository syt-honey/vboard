import { makeAutoObservable, runInAction } from 'mobx'
import { ipcSyncByApp } from '../utils/ipc'

export class Media {
    private mediaList: Electron.DesktopCapturerSource[] = []
    private readonly sourceName: string = 'Entire screen'

    constructor() {
        makeAutoObservable(this)
    }

    public async initMedia(): Promise<Electron.DesktopCapturerSource> {
        return await ipcSyncByApp('get-media').then((sources) => {
            runInAction(() => {
                this.mediaList = sources
            })
            return this.getMedia()
        })
    }

    public getMedia(): Electron.DesktopCapturerSource {
        return this.mediaList.find((source) => source.name === this.sourceName) || this.mediaList[0]
    }
}

export const mediaStore = new Media()
