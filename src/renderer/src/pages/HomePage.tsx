import { Button, Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import React, { useContext, useMemo } from 'react'

import { DevicesTypeKey } from '../store/devices'
import { SVGCamera, SVGMic } from '../components/global'
import { DevicesContext } from '../components/StoreProvider'
import { useDeviceSelect, useDeviceOn } from '../hooks/device'
import {
    ipcCreateCounterWindow,
    ipcHideMainWindow,
    ipcCreateCameraWindow,
    ipcCloseCameraWindow
} from '../utils'

export const HomePage = observer<React.FC>(() => {
    const { t } = useTranslation()
    const devicesStore = useContext(DevicesContext)

    const { handleChange } = useDeviceSelect({ devicesStore, callCamera })
    const { handleOn: handleOnAudio } = useDeviceOn({
        devicesStore,
        handleChange,
        callCamera,
        closeCamera
    })
    const { handleOn: handleOnVideo } = useDeviceOn({
        devicesStore,
        handleChange,
        closeCamera,
        callCamera
    })

    const deviceSelects = useMemo(() => {
        return {
            audioinput: {
                isOn: devicesStore.audioOn,
                text: t('devices.audioinputNoText'),
                icon: devicesStore.audioOn ? <SVGMic isMuted={false} /> : <SVGMic isMuted />,
                devices: devicesStore.devices.audioinput,
                defaultId: devicesStore.selectedAudioInput,
                handleChange,
                switchOn: {
                    text: devicesStore.audioOn ? t('devices.isOn') : t('devices.isOff'),
                    handleOn: handleOnAudio
                }
            },
            videoinput: {
                isOn: devicesStore.videoOn,
                text: t('devices.videoinputNoText'),
                icon: devicesStore.videoOn ? <SVGCamera isMuted={false} /> : <SVGCamera isMuted />,
                devices: devicesStore.devices.videoinput,
                defaultId: devicesStore.selectedVideoInput,
                handleChange,
                switchOn: {
                    text: devicesStore.videoOn ? t('devices.isOn') : t('devices.isOff'),
                    handleOn: handleOnVideo
                }
            }
        }
    }, [devicesStore.audioOn, devicesStore.videoOn, devicesStore.devices])

    function callCamera(): void {
        closeCamera()
        ipcCreateCameraWindow({ url: '/camera' })
    }

    function closeCamera(): void {
        ipcCloseCameraWindow()
    }

    const callRecording = (): void => {
        ipcHideMainWindow()
        ipcCreateCounterWindow({ url: '/counter' })
    }

    return (
        <div className="main-page">
            <div className="devices">
                {Object.keys(deviceSelects).map((key) => (
                    <div key={key}>
                        <div className="devices-title">{t(`devices.${key}`)}</div>

                        {renderSelect({
                            ...deviceSelects[key],
                            type: key as DevicesTypeKey
                        })}
                    </div>
                ))}
            </div>

            <Button className="start-btn" type="primary" onClick={callRecording}>
                {t('start')}
            </Button>
        </div>
    )
})

export interface HandleProps {
    isOn: boolean
    text: string
    type: DevicesTypeKey
    handleOn: (value, type) => void
}

export const renderHandleOn = ({ isOn, text, type, handleOn }: HandleProps): React.ReactNode => {
    return (
        <Button
            className={`devices-operator${isOn ? '' : ' devices-operator-off'}`}
            shape="round"
            onClick={(): void => handleOn(!isOn, type)}
        >
            {text}
        </Button>
    )
}

export interface SelectProps {
    icon: React.ReactNode
    isOn: boolean
    text: string

    switchOn: Partial<HandleProps>
    devices: MediaDeviceInfo[]
    type: DevicesTypeKey
    defaultId: string
    handleChange: (type, value) => void
}

export const renderSelect = ({
    isOn,
    icon,
    text,

    type,
    devices,
    defaultId,
    switchOn,
    handleChange
}: SelectProps): React.ReactNode => {
    return isOn ? (
        <div className="devices-select-group">
            <Select
                className="devices-select"
                placeholder={text}
                defaultValue={defaultId}
                suffixIcon=""
                onChange={(value): void => handleChange(type, value)}
                loading={!devices.length}
            >
                {devices.map(({ label, deviceId }) => {
                    return (
                        <Select.Option key={deviceId} value={deviceId}>
                            {label}
                        </Select.Option>
                    )
                })}
            </Select>
            {renderHandleOn({
                ...switchOn,
                isOn,
                type
            } as HandleProps)}
        </div>
    ) : (
        <div className="devices-select-btn-group">
            <Button className="devices-select-btn" shape="round" icon={icon}>
                {text}
            </Button>
            {renderHandleOn({
                ...switchOn,
                isOn,
                type
            } as HandleProps)}
        </div>
    )
}

export default HomePage
