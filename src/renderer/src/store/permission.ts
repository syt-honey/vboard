import { makeAutoObservable, runInAction } from 'mobx'

import { ipcSyncByApp } from '../utils'

export class Permission {
    public audioPermission: boolean = false
    public videoPermission: boolean = false
    public screenPermission: boolean = false

    constructor() {
        makeAutoObservable(this)

        this.initPermission()
    }

    public updateScreenPermission = (permission: boolean): void =>
        void (this.screenPermission = permission)
    public updateAudioPermission = (value: boolean): void => void (this.audioPermission = value)
    public updateVideoPermission = (value: boolean): void => void (this.videoPermission = value)

    public get checkDevicesPermission(): boolean {
        return this.audioPermission && this.videoPermission && this.screenPermission
    }

    public initPermission = async (): Promise<void> =>
        Promise.all([
            this.checkAudioPermission(),
            this.checkVideoPermission(),
            this.checkScreenPermission()
        ]).then(([audioPermission, videoPermission, screenPermission]) => {
            runInAction(() => {
                this.updateAudioPermission(audioPermission)
                this.updateVideoPermission(videoPermission)
                this.updateScreenPermission(screenPermission)
            })
        })

    public checkAudioPermission = async (): Promise<boolean> =>
        await ipcSyncByApp('get-devices-permission', { mediaType: 'microphone' })

    public checkVideoPermission = async (): Promise<boolean> =>
        await ipcSyncByApp('get-devices-permission', { mediaType: 'camera' })

    public checkScreenPermission = async (): Promise<boolean> =>
        await ipcSyncByApp('get-devices-permission', { mediaType: 'screen' })

    public requestAudioPermission = async (): Promise<boolean> =>
        await ipcSyncByApp('request-devices-permission', { mediaType: 'microphone' })

    public requestVideoPermission = async (): Promise<boolean> =>
        await ipcSyncByApp('request-devices-permission', { mediaType: 'camera' })
}

export const permissionStore = new Permission()
