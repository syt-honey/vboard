import { useCallback } from 'react'

import { DevicesTypeValue, devicesStore } from '../store/devices'

interface IDeviceSelect {
    devicesStore: typeof devicesStore
}

interface IDeviceSelectReturn {
    handleChange: (type: DevicesTypeValue, value?: string | null) => void
}

export const useDeviceSelect = ({ devicesStore }: IDeviceSelect): IDeviceSelectReturn => {
    const handleChange = useCallback(
        (type, value) => {
            devicesStore.setSelectedDevices(type, value)
        },
        [devicesStore]
    )

    return { handleChange }
}

interface IDeviceOn {
    devicesStore: typeof devicesStore
    handleChange: (type: DevicesTypeValue, value?: string | null) => void
}

interface IDeviceReturn {
    handleOn: (isOn: boolean, type: DevicesTypeValue) => void
}

export const useDeviceOn = ({ devicesStore, handleChange }: IDeviceOn): IDeviceReturn => {
    const handleOn = useCallback(
        async (isOn, type) => {
            if (isOn) {
                await checkDevices()

                // set default devices
                handleChange(type)
            } else {
                // clear default devices
                handleChange(type, null)
            }

            updateDeviceStatus(isOn, type)
        },
        [devicesStore]
    )

    const checkDevices = useCallback(async () => {
        if (!devicesStore.checkDevices) {
            await devicesStore.initDevices()
        }
    }, [devicesStore])

    const updateDeviceStatus = useCallback(
        (status, type) => {
            if (type === DevicesTypeValue.AUDIO_INPUT) {
                devicesStore.updateAudioOn(status)
            } else if (type === DevicesTypeValue.VIDEO_INPUT) {
                devicesStore.updateVideoOn(status)
            }
        },
        [devicesStore]
    )

    return { handleOn }
}
