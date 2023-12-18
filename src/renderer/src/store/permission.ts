import { makeAutoObservable, runInAction } from 'mobx'

import { ipcSyncByApp, getUserScreenStream } from '../utils'
import { DeviceType } from '../types/device'

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
        await ipcSyncByApp('getDevicesPermission', { mediaType: DeviceType.Microphone })

    public checkVideoPermission = async (): Promise<boolean> =>
        await ipcSyncByApp('getDevicesPermission', { mediaType: DeviceType.Camera })

    public checkScreenPermission = async (): Promise<boolean> =>
        await ipcSyncByApp('getDevicesPermission', { mediaType: DeviceType.Screen })

    public requestAudioPermission = async (): Promise<boolean> =>
        await ipcSyncByApp('requestDevicesPermission', { mediaType: DeviceType.Microphone })

    public requestVideoPermission = async (): Promise<boolean> =>
        await ipcSyncByApp('requestDevicesPermission', { mediaType: DeviceType.Camera })

    public requestScreenPermission = async (): Promise<boolean> =>
        await ipcSyncByApp('requestDevicesPermission', { mediaType: DeviceType.Screen })

    public requestScreenPermissionByApi = async (): Promise<boolean> => {
        try {
            await getUserScreenStream('')
            return true
        } catch {
            return false
        }
    }
}

export const permissionStore = new Permission()
