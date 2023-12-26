import './index.css'

import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { LoadingOutlined } from '@ant-design/icons'
import { useMemo, useState, useEffect } from 'react'

import { formatSeconds } from '@renderer/utils'
import { Devices, Recorder } from '@renderer/store'
import { SVGResume, SVGPause, SVGCancel, SVGCamera, SVGMic, SVGPencil } from '../global'

export interface ToolBoxProps {
    loading: boolean
    volume: number
    recorderStore: Recorder
    devicesStore: Devices
    boardOpened: boolean
    handleFinish: () => void
    handlePause: () => void
    handleResume: () => void
    handleCancel: () => void
    handleMicSwitch: () => void
    handleCameraSwitch: () => void
    handleBoardSwitch: () => void
}

export const ToolBox = observer(
    ({
        loading,
        volume,
        recorderStore,
        devicesStore,
        boardOpened,
        handleFinish,
        handlePause,
        handleResume,
        handleCameraSwitch,
        handleCancel,
        handleMicSwitch,
        handleBoardSwitch
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
                {loading ? (
                    <LoadingOutlined />
                ) : (
                    <>
                        <span className="text">{text}</span>

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
                            icon={
                                <SVGCamera
                                    isMuted={!devicesStore.videoOn}
                                    style={{ fill: '#E8E9EA' }}
                                />
                            }
                            onClick={handleCameraSwitch}
                        />

                        <Button
                            type="link"
                            icon={<SVGPencil opened={boardOpened} />}
                            onClick={handleBoardSwitch}
                        />
                    </>
                )}
            </div>
        )
    }
)

export default ToolBox
