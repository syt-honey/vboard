import { makeAutoObservable, runInAction } from 'mobx'
import { ipcSyncByApp } from '../utils/ipc'
import { ScreenWorkAreaType } from '@renderer/types/ipc'

export class Screen {
    private readonly sourceName: string[] = ['Entire screen', '整个屏幕', 'Screen 1']
    private readonly sourceId: string[] = ['screen', 'root']
    private readonly regx: RegExp = /:.+/g

    private screenList: Electron.DesktopCapturerSource[] = []
    public workArea: ScreenWorkAreaType | null = null

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

    public initScreenWorkArea = async (): Promise<void> => {
        const workArea = await ipcSyncByApp('get-screen-work-area')

        runInAction(() => {
            this.workArea = workArea
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
