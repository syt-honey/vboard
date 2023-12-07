import './index.css'

import { Button, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useMemo, useState, useEffect } from 'react'

import { SVGResume, SVGPause, SVGCancel, SVGCamera, SVGMic } from '../global'
import { Devices, Recorder } from '../../store'
import { formatSeconds } from '../../utils'

export interface ToolBoxProps {
    volume: number
    recorderStore: Recorder
    devicesStore: Devices
    handleFinish: () => void
    handlePause: () => void
    handleResume: () => void
    handleCancel: () => void
    handleMicSwitch: () => void
    handleCameraSwitch: () => void
}

export const ToolBox = observer(
    ({
        volume,
        recorderStore,
        devicesStore,
        handleFinish,
        handlePause,
        handleResume,
        handleCameraSwitch,
        handleCancel,
        handleMicSwitch
    }: ToolBoxProps) => {
        const { t } = useTranslation()

        const [timer, setTimer] = useState('')
        const isRecording = useMemo(() => recorderStore.isRecording, [recorderStore.isRecording])
        const text = useMemo(() => (isRecording ? timer : t('paused')), [isRecording, timer])

        useEffect(() => {
            setTimer(formatSeconds(recorderStore.duration))
        }, [recorderStore.duration])

        return (
            <div className="tool-box">
                {<span className="text">{text}</span>}

                <Tooltip title={t('finish')}>
                    <Button
                        type="link"
                        className={`stop-btn ${
                            isRecording ? 'stop-btn-recording' : 'stop-btn-pausing'
                        }`}
                        onClick={handleFinish}
                    />
                </Tooltip>

                <Tooltip title={t(isRecording ? 'pause' : 'resume')}>
                    <Button
                        className="pause-btn"
                        type="link"
                        icon={isRecording ? <SVGPause /> : <SVGResume />}
                        onClick={isRecording ? handlePause : handleResume}
                    />
                </Tooltip>

                <Tooltip title={t('cancel')}>
                    <Button
                        type="link"
                        icon={<SVGCancel style={{ fill: '#E8E9EA' }} />}
                        onClick={handleCancel}
                    />
                </Tooltip>

                <Tooltip title={t(devicesStore.audioOn ? 'devices.isOff' : 'devices.isOn')}>
                    <Button
                        type="link"
                        icon={
                            <SVGMic
                                volume={volume}
                                style={{ fill: '#E8E9EA' }}
                                isMuted={!devicesStore.audioOn}
                            />
                        }
                        onClick={handleMicSwitch}
                    />
                </Tooltip>

                <Tooltip title={t(devicesStore.videoOn ? 'devices.isOff' : 'devices.isOn')}>
                    <Button
                        type="link"
                        icon={
                            <SVGCamera
                                isMuted={!devicesStore.videoOn}
                                style={{ fill: '#E8E9EA' }}
                            />
                        }
                        onClick={handleCameraSwitch}
                    />
                </Tooltip>
            </div>
        )
    }
)

export default ToolBox
