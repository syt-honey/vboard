import './index.css'

import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useMemo, useCallback, useState, useEffect } from 'react'

import { SVGResume, SVGPause, SVGCancel, SVGCamera, SVGMic } from '../global'
import { Recorder } from '../../store/recorder'
import { formatSeconds } from '../../utils'
import {
    ipcCloseCameraWindow,
    ipcCreateCameraWindow,
    ipcSyncByApp,
    ipcCloseRecordingWindow
} from '../../utils/ipc'

export interface ToolBoxProps {
    recorderStore: Recorder
}

export const ToolBox = observer(({ recorderStore }: ToolBoxProps) => {
    const { t } = useTranslation()

    const isRecording = useMemo(() => recorderStore.isRecording, [recorderStore.isRecording])
    const [timer, setTimer] = useState('')
    const text = useMemo(() => (isRecording ? timer : t('paused')), [isRecording, timer])

    const [cameraMuted, setCameraMuted] = useState(false)
    const [audioMuted, setAudioMuted] = useState(false)

    useEffect(() => {
        setTimer(formatSeconds(recorderStore.duration))
    }, [recorderStore.duration])

    const finish = useCallback(async () => {
        if (await recorderStore.finish()) {
            recorderStore.destroyed()

            ipcCloseRecordingWindow()
            ipcCloseCameraWindow()
        } else {
            // paused
        }
    }, [recorderStore])

    const cancel = useCallback(async () => {
        if (
            await ipcSyncByApp('confirm-dialog', {
                title: t('cancelRecordering.title'),
                message: t('cancelRecordering.message'),
                buttons: [t('cancelRecordering.confirmBtn'), t('cancelRecordering.cancelBtn')]
            })
        ) {
            recorderStore.cancel()
        }
    }, [recorderStore])

    const switchMic = useCallback(() => {
        audioMuted ? recorderStore.unmuteAudio() : recorderStore.muteAudio()
        setAudioMuted(!audioMuted)
    }, [recorderStore, setAudioMuted, audioMuted])

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
                onClick={finish}
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
            <Button
                type="link"
                icon={<SVGMic volume={recorderStore.volume} isMuted={audioMuted} />}
                onClick={switchMic}
            />
            <Button type="link" icon={<SVGCamera isMuted={cameraMuted} />} onClick={switchCamera} />
        </div>
    )
})

export default ToolBox
