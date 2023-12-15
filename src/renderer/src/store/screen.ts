import { makeAutoObservable, runInAction } from 'mobx'
import { ipcSyncByApp } from '../utils/ipc'

export class Screen {
    private readonly sourceName: string[] = ['Entire screen', '整个屏幕', 'Screen 1']
    private readonly sourceId: string[] = ['screen', 'root']
    private readonly regx: RegExp = /:.+/g

    private screenList: Electron.DesktopCapturerSource[] = []
    public primaryDisplay: Pick<Electron.Display, 'size' | 'workArea' | 'workAreaSize'> | null =
        null

    constructor() {
        makeAutoObservable(this)
    }

    public async initScreen(): Promise<Electron.DesktopCapturerSource> {
        return await ipcSyncByApp('getScreen').then((sources) => {
            runInAction(() => {
                this.screenList = sources
            })
            return this.getScreen()
        })
    }

    public initScreenPrimaryDisplay = async (): Promise<void> => {
        const primaryDisplay = await ipcSyncByApp('getScreenPrimaryDisplay')

        runInAction(() => {
            this.primaryDisplay = primaryDisplay
        })
    }

    public getScreen(): Electron.DesktopCapturerSource {
        return (
            this.screenList.find(
                (source) =>
                    this.sourceName.indexOf(source.name) > -1 ||
                    this.sourceId.indexOf(source.id?.replace(this.regx, '')) > -1
            ) || this.screenList[0]
        )
    }
}

export const screenStore = new Screen()
