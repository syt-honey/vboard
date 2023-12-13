import { Button, Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import React, { useContext, useEffect, useMemo } from 'react'

// import { useAudioAnalyser } from '../hooks'
import { DevicesTypeKey } from '../store/devices'
import { SVGCamera, SVGMic } from '../components/global'
import { DevicesContext, PermissionContext } from '../components/StoreProvider'
import { ipcCreateCounterWindow, ipcHideMainWindow } from '../utils'
import { CameraPage } from './CameraPage'

export const HomePage = observer<React.FC>(() => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const devicesStore = useContext(DevicesContext)
    const permissionStore = useContext(PermissionContext)

    // const { analyserInit, volume } = useAudioAnalyser()
    const {
        audioOn,
        videoOn,
        devices,
        selectedAudioInput,
        selectedVideoInput,
        handleDevicesSelect,
        handleDevicesOn,
        setAudioDevices
    } = devicesStore

    const { checkDevicesPermission } = permissionStore
    const showTestPage = useMemo(() => videoOn && selectedVideoInput, [videoOn, selectedVideoInput])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!checkDevicesPermission) {
                // to permission page
                navigate('/permission')
            }
        }, 500)

        return (): void => clearTimeout(timer)
    }, [checkDevicesPermission])

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
    }, [audioOn, videoOn, devices, selectedAudioInput, selectedVideoInput])

    useEffect(() => {
        if (!audioOn && selectedAudioInput !== null) {
            setAudioDevices(null)
        }
    }, [audioOn])

    const callRecording = (): void => {
        ipcHideMainWindow()
        ipcCreateCounterWindow({ url: '/counter' })
    }

    return (
        <div className="main-page">
            {showTestPage && (
                <CameraPage
                    selectedVideoInput={devicesStore.selectedVideoInput!}
                    updateVideoPermission={permissionStore.updateVideoPermission}
                ></CameraPage>
            )}

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
