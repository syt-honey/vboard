import { useCallback } from 'react'

import { DevicesTypeValue, devicesStore } from '../store/devices'

interface IDeviceSelect {
    devicesStore: typeof devicesStore
    callCamera: () => void
}

interface IDeviceSelectReturn {
    handleChange: (type: DevicesTypeValue, value?: string | null) => void
}

export const useDeviceSelect = ({
    devicesStore,
    callCamera
}: IDeviceSelect): IDeviceSelectReturn => {
    const handleChange = useCallback(
        (type, value) => {
            devicesStore.setSelectedDevices(type, value)

            if (value && type === DevicesTypeValue.VIDEO_INPUT) {
                void callCamera()
            }
        },
        [devicesStore]
    )

    return { handleChange }
}

interface IDeviceOn {
    devicesStore: typeof devicesStore
    handleChange: (type: DevicesTypeValue, value?: string | null) => void
    closeCamera: () => void
    callCamera: () => void
}

interface IDeviceReturn {
    handleOn: (isOn: boolean, type: DevicesTypeValue) => void
}

export const useDeviceOn = ({
    devicesStore,
    closeCamera,
    handleChange,
    callCamera
}: IDeviceOn): IDeviceReturn => {
    const handleOn = useCallback(
        async (isOn, type) => {
            if (isOn) {
                await checkDevices()

                // set default devices
                handleChange(type)

                if (type === DevicesTypeValue.VIDEO_INPUT) {
                    void callCamera()
                }
            } else {
                // clear default devices
                handleChange(type, null)

                if (type === DevicesTypeValue.VIDEO_INPUT) {
                    closeCamera()
                }
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
