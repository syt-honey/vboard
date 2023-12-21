import { runInAction } from 'mobx'

import { getSystemDevices } from '../utils'
import { autoPersistStore } from '../utils/auto-persist-store'

const LS_VERSION = 1

let isInit = false

const defaultDevices: DevicesList = {
    audioinput: [],
    audiooutput: [],
    videoinput: []
}

export class Devices {
    public devices = defaultDevices

    public selectedAudioInput: string | null = null
    public selectedAudioOutput: string | null = null
    public selectedVideoInput: string | null = null

    public audioOutOn: boolean = true
    public audioOn: boolean = false
    public videoOn: boolean = false

    constructor() {
        autoPersistStore({ storeLSName: 'DevicesStore', store: this, version: LS_VERSION })
        // need time to get the devices
        this.handleDevicesCheck()
    }

    public get checkDevices(): boolean {
        return Object.values(this.devices).some((i) => i.length > 0)
    }

    public isDiff = (target: DevicesList): boolean => {
        if (!target) return true

        return Object.keys(this.devices).some((t) => {
            if (this.devices[t].length !== target[t]?.length) return true

            return this.devices[t].some(
                (m: MediaDeviceInfo) =>
                    !target[t]?.find((i: MediaDeviceInfo) => i.deviceId === m.deviceId)
            )
        })
    }

    public clearDevices = (): void => {
        this.devices = {
            audioinput: [],
            audiooutput: [],
            videoinput: []
        }

        this.selectedAudioInput = null
        this.selectedAudioOutput = null
        this.selectedVideoInput = null

        this.audioOn = false
        this.audioOutOn = false
        this.videoOn = false
    }

    public handleDevicesCheck = async (): Promise<void> => {
        if (isInit) return
        isInit = true

        const devices = await this.getSystemDevices()

        runInAction(() => {
            if (this.isDiff(devices)) {
                this.clearDevices()
                this.devices = devices
            }

            isInit = false
        })
    }

    public handleDevicesOn = async (isOn: boolean, type: DevicesTypeKey): Promise<void> => {
        if (isOn) {
            // set default devices
            this.handleDevicesSelect(type)
        } else {
            // clear default devices
            this.handleDevicesSelect(type, null)
        }

        this.handleDevicesStatusUpdate(isOn, type)
    }

    public handleDevicesStatusUpdate = (status: boolean, type: DevicesTypeKey): void => {
        if (type === DevicesTypeValue.AUDIO_INPUT) {
            this.updateAudioOn(status)
        } else if (type === DevicesTypeValue.VIDEO_INPUT) {
            this.updateVideoOn(status)
        }
    }

    public handleDevicesSelect = (type: DevicesTypeKey, value?: string | null): void => {
        if (type === DevicesTypeValue.AUDIO_INPUT) {
            this.setAudioDevices(value)
        } else if (type === DevicesTypeValue.AUDIO_OUTPUT) {
            // todo
        } else if (type === DevicesTypeValue.VIDEO_INPUT) {
            this.setVideoDevices(value)
        }
    }

    public updateAudioOn = (value: boolean): void => void (this.audioOn = value)
    public updateVideoOn = (value: boolean): void => void (this.videoOn = value)

    public setAudioDevices = (value?: string | null): void => {
        if (typeof value === 'string' || value === null) {
            // update or clear
            this.selectedAudioInput = value
        } else {
            // default
            if (this.checkDevices) {
                this.selectedAudioInput = this.devices.audioinput[0].deviceId
            }
        }
    }

    public setVideoDevices = (value?: string | null): void => {
        if (typeof value === 'string' || value === null) {
            // update or clear
            this.selectedVideoInput = value
        } else {
            // default
            if (this.checkDevices) {
                this.selectedVideoInput = this.devices.videoinput[0].deviceId
            }
        }
    }

    public getSystemDevices = async (): Promise<DevicesList> => {
        const devices = await getSystemDevices()

        return devices.reduce((acc, cur) => {
            if (!acc[cur.kind]?.find((i) => i.groupId === cur.groupId)) {
                if (!acc[cur.kind]) {
                    acc[cur.kind] = []
                }
                acc[cur.kind].push(cur)
            }

            return acc
        }, defaultDevices)
    }
}

export enum DevicesTypeValue {
    AUDIO_INPUT = 'audioinput',
    AUDIO_OUTPUT = 'audiooutput',
    VIDEO_INPUT = 'videoinput'
}

export type DevicesType = {
    [key in DevicesTypeValue]: string
}

export type DevicesTypeKey = keyof DevicesType

export type DevicesList = {
    [K in DevicesTypeKey]: MediaDeviceInfo[]
}

export const devicesStore = new Devices()
