import './index.css'

import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { LoadingOutlined } from '@ant-design/icons'
import { useMemo, useState, useEffect, useCallback } from 'react'

import { Tooltip } from '../Tooltip'
import { formatSeconds } from '@renderer/utils'
import { Devices, Recorder } from '@renderer/store'
import { SVGResume, SVGPause, SVGCancel, SVGCamera, SVGMic, SVGPencil } from '../global'

export interface ToolBoxProps {
    loading: boolean
    volume: number
    recorderStore: Recorder
    devicesStore: Devices
    boardOpened: boolean
    windowRect: Electron.Rectangle | null
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
        windowRect,
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
        const [tip, setTip] = useState({
            show: false,
            title: ''
        })
        const [tipPosition, setTipPosition] = useState({
            x: 0,
            y: 0,
            height: 35,
            width: 200
        })
        const isRecording = useMemo(() => recorderStore.isRecording, [recorderStore.isRecording])
        const text = useMemo(() => (isRecording ? timer : t('paused')), [isRecording, timer])

        useEffect(() => {
            setTimer(formatSeconds(recorderStore.duration))
        }, [recorderStore.duration])

        const onMouseEnter = useCallback(
            (e, title): void => {
                const targetBounds = e.target?.getBoundingClientRect()

                if (targetBounds && title) {
                    setTipPosition({
                        ...tipPosition,
                        x: Math.ceil(windowRect?.x + targetBounds.x + targetBounds.width + 10),
                        y: Math.ceil(
                            windowRect?.y +
                                targetBounds.y +
                                (targetBounds.height - tipPosition.height) / 2
                        )
                    })

                    setTip({
                        title,
                        show: true
                    })
                }

                e.preventDefault()
            },
            [tip, tipPosition, windowRect]
        )

        const onMouseLeave = useCallback(() => {
            setTip({
                ...tip,
                show: false
            })
        }, [tip])

        return (
            <div className="tool-box">
                {loading ? (
                    <LoadingOutlined />
                ) : (
                    <>
                        <span className="text">{text}</span>

                        {tip.show && <Tooltip position={tipPosition} title={tip.title}></Tooltip>}

                        <Button
                            onMouseEnter={(e): void => onMouseEnter(e, t('finish'))}
                            onMouseLeave={onMouseLeave}
                            type="link"
                            className={`stop-btn ${
                                isRecording ? 'stop-btn-recording' : 'stop-btn-pausing'
                            }`}
                            onClick={handleFinish}
                        />

                        <Button
                            onMouseEnter={(e): void =>
                                onMouseEnter(e, t(isRecording ? 'pause' : 'resume'))
                            }
                            onMouseLeave={onMouseLeave}
                            className="pause-btn"
                            type="link"
                            icon={isRecording ? <SVGPause /> : <SVGResume />}
                            onClick={isRecording ? handlePause : handleResume}
                        />

                        <Button
                            onMouseEnter={(e): void => onMouseEnter(e, t('cancel'))}
                            onMouseLeave={onMouseLeave}
                            type="link"
                            icon={<SVGCancel style={{ fill: '#E8E9EA' }} />}
                            onClick={handleCancel}
                        />

                        <Button
                            onMouseEnter={(e): void =>
                                onMouseEnter(
                                    e,
                                    t(
                                        devicesStore.audioOn
                                            ? 'devices.isTurnOff'
                                            : 'devices.isTurnOn'
                                    )
                                )
                            }
                            onMouseLeave={onMouseLeave}
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
                            onMouseEnter={(e): void =>
                                onMouseEnter(
                                    e,
                                    t(
                                        devicesStore.videoOn
                                            ? 'devices.isTurnOff'
                                            : 'devices.isTurnOn'
                                    )
                                )
                            }
                            onMouseLeave={onMouseLeave}
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
                            onMouseEnter={(e): void =>
                                onMouseEnter(e, t(boardOpened ? 'board.isOff' : 'board.isOn'))
                            }
                            onMouseLeave={onMouseLeave}
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
