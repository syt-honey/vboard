import './index.css'

import { Button } from 'antd'
import { useMemo, useContext, useCallback, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'

import { RecorderContext } from '../StoreProvider'
import { SVGResume, SVGPause, SVGCancel, SVGCamera, SVGMic } from '../global'
import { formatSeconds } from '../../utils'
import { ipcCloseCameraWindow, ipcCreateCameraWindow } from '../../utils/ipc'

export const ToolBox = observer(() => {
    const { t } = useTranslation()

    const recorderStore = useContext(RecorderContext)
    const isRecording = useMemo(() => recorderStore.isRecording, [recorderStore.isRecording])
    const [duration, setDuration] = useState(0)
    const timer = useMemo(() => formatSeconds(duration), [duration])
    const text = useMemo(() => (isRecording ? timer : t('paused')), [isRecording, timer])

    const [cameraMuted, setCameraMuted] = useState(false)

    useEffect(() => {
        // @FIXME: timer should be paused
        const timer = setTimeout(() => {
            setDuration(duration + 1)
        }, 1000)

        return (): void => clearTimeout(timer)
    }, [duration])

    const stop = useCallback(async () => {
        await recorderStore.stop()
        // ipcCloseRecordingWindow()
    }, [recorderStore])

    const cancel = useCallback(() => {
        recorderStore.cancel()
        // ipcCloseCameraWindow()
        // ipcCloseRecordingWindow()
    }, [recorderStore])

    // @TODO: switch microphone
    const switchMic = (): void => {}

    const switchCamera = useCallback(() => {
        cameraMuted ? ipcCreateCameraWindow({ url: '/camera' }) : ipcCloseCameraWindow()
        setCameraMuted(!cameraMuted)
    }, [setCameraMuted, cameraMuted])

    return (
        <div className="tool-box">
            {<span className="text">{text}</span>}

            <Button
                type="link"
                className={`stop-btn ${isRecording ? 'stop-btn-recording' : 'stop-btn-pausing'}`}
                onClick={stop}
            />
            <Button
                className="pause-btn"
                type="link"
                icon={isRecording ? <SVGPause /> : <SVGResume />}
                onClick={
                    isRecording
                        ? (): void => recorderStore.pause()
                        : (): void => recorderStore.resume()
                }
            />
            <Button type="link" icon={<SVGCancel />} onClick={cancel} />
            <Button type="link" icon={<SVGMic />} onClick={switchMic} />
            <Button type="link" icon={<SVGCamera isMuted={cameraMuted} />} onClick={switchCamera} />
        </div>
    )
})

export default ToolBox
