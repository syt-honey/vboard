import { getSystemDevices } from '../utils'
import { makeAutoObservable, runInAction } from 'mobx'

export class Devices {
    public isInit: boolean = false
    public devices: DevicesList = {
        audioinput: [],
        audiooutput: [],
        videoinput: []
    }

    public selectedAudioInput: string | null = null
    public selectedAudioOutput: string | null = null
    public selectedVideoInput: string | null = null

    constructor() {
        makeAutoObservable(this)
    }

    public get checkDevices(): boolean {
        return Object.values(this.devices).some((i) => i.length > 0)
    }

    public setSelectedDevices(value: string, type: DevicesTypeKey): void {
        if (type === DevicesTypeValue.AUDIO_INPUT) {
            this.selectedAudioInput = value
        }

        if (type === DevicesTypeValue.AUDIO_OUTPUT) {
            this.selectedAudioOutput = value
        }

        if (type === DevicesTypeValue.VIDEO_INPUT) {
            this.selectedVideoInput = value
        }
    }

    public async initDevices(): Promise<void> {
        if (this.isInit) return

        this.isInit = true
        const devices = await getSystemDevices()
        runInAction(() => {
            this.devices = devices.reduce((acc, cur) => {
                if (!acc[cur.kind]?.find((i) => i.groupId === cur.groupId)) {
                    if (!acc[cur.kind]) {
                        acc[cur.kind] = []
                    }
                    acc[cur.kind].push(cur)
                }

                return acc
            }, this.devices)

            this.isInit = false
        })
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
