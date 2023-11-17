import { Button, Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import React, { useContext, useEffect, useMemo } from 'react'

// import { useAudioAnalyser } from '../hooks'
import { DevicesTypeKey } from '../store/devices'
import { SVGCamera, SVGMic } from '../components/global'
import { DevicesContext } from '../components/StoreProvider'
import {
    ipcCreateCounterWindow,
    ipcHideMainWindow,
    ipcCreateCameraWindow,
    ipcCloseCameraWindow
} from '../utils'

export const HomePage = observer<React.FC>(() => {
    const { t } = useTranslation()
    const devicesStore = useContext(DevicesContext)

    // const { analyserInit, volume } = useAudioAnalyser()
    const {
        audioOn,
        videoOn,
        devices,
        selectedAudioInput,
        selectedVideoInput,
        handleDevicesSelect,
        handleDevicesOn
    } = devicesStore

    // TODO: use volume to get wave animation
    // console.log(analyserInit, volume)

    // useEffect(() => {
    //     if (selectedAudioInput) {
    //         analyserInit(selectedAudioInput)
    //         console.log(volume)
    //     }
    // }, [selectedAudioInput, volume])

    const deviceConfig = useMemo(() => {
        return {
            audioinput: {
                isOn: audioOn,
                text: t('devices.audioinputNoText'),
                icon: audioOn ? <SVGMic isMuted={false} /> : <SVGMic isMuted />,
                devices: devices.audioinput,
                defaultId: selectedAudioInput,
                handleChange: handleDevicesSelect,
                switchOn: {
                    handleOn: handleDevicesOn,
                    text: audioOn ? t('devices.isOn') : t('devices.isOff')
                }
            },
            videoinput: {
                isOn: videoOn,
                text: t('devices.videoinputNoText'),
                icon: videoOn ? <SVGCamera isMuted={false} /> : <SVGCamera isMuted />,
                devices: devices.videoinput,
                defaultId: selectedVideoInput,
                handleChange: handleDevicesSelect,
                switchOn: {
                    handleOn: handleDevicesOn,
                    text: videoOn ? t('devices.isOn') : t('devices.isOff')
                }
            }
        }
    }, [audioOn, videoOn, devices])

    useEffect(() => {
        if (selectedVideoInput) {
            callCamera()
        } else {
            closeCamera()
        }

        return (): void => closeCamera()
    }, [selectedVideoInput])

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
                {Object.keys(deviceConfig).map((key) => (
                    <div key={key}>
                        {renderSelect({
                            ...deviceConfig[key],
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
