import { makeAutoObservable, runInAction } from 'mobx'
import { ipcSyncByApp } from '../utils/ipc'

export class Screen {
    private readonly sourceName: string = 'Entire screen'

    private screenList: Electron.DesktopCapturerSource[] = []

    constructor() {
        makeAutoObservable(this)
    }

    public async initScreen(): Promise<Electron.DesktopCapturerSource> {
        return await ipcSyncByApp('get-screen').then((sources) => {
            runInAction(() => {
                this.screenList = sources
            })
            return this.getScreen()
        })
    }

    public getScreen(): Electron.DesktopCapturerSource {
        return (
            this.screenList.find((source) => source.name === this.sourceName) || this.screenList[0]
        )
    }
}

export const screenStore = new Screen()
