import './index.css'

import { Button } from 'antd'
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

                <Button
                    type="link"
                    className={`stop-btn ${
                        isRecording ? 'stop-btn-recording' : 'stop-btn-pausing'
                    }`}
                    onClick={handleFinish}
                />
                <Button
                    className="pause-btn"
                    type="link"
                    icon={isRecording ? <SVGPause /> : <SVGResume />}
                    onClick={isRecording ? handlePause : handleResume}
                />
                <Button
                    type="link"
                    icon={<SVGCancel style={{ fill: '#E8E9EA' }} />}
                    onClick={handleCancel}
                />
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
                <Button
                    type="link"
                    icon={<SVGCamera isMuted={!devicesStore.videoOn} style={{ fill: '#E8E9EA' }} />}
                    onClick={handleCameraSwitch}
                />
            </div>
        )
    }
)

export default ToolBox
