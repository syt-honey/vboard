import './index.css'

import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useMemo, useCallback, useState, useEffect, useContext } from 'react'

import { SVGResume, SVGPause, SVGCancel, SVGCamera, SVGMic } from '../global'
import { DevicesContext } from '../StoreProvider'
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
    const devicesStore = useContext(DevicesContext)

    const [timer, setTimer] = useState('')
    const isRecording = useMemo(() => recorderStore.isRecording, [recorderStore.isRecording])
    const text = useMemo(() => (isRecording ? timer : t('paused')), [isRecording, timer])

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
        if (devicesStore.audioOn) {
            recorderStore.unmuteAudio()
        } else {
            recorderStore.muteAudio()
        }
        devicesStore.updateAudioOn(!devicesStore.audioOn)
    }, [recorderStore, devicesStore])

    const switchCamera = useCallback(() => {
        if (devicesStore.videoOn) {
            ipcCreateCameraWindow({ url: '/camera' })
        } else {
            ipcCloseCameraWindow()
        }
        devicesStore.updateVideoOn(!devicesStore.videoOn)
    }, [devicesStore])

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
            <Button type="link" icon={<SVGCancel style={{ fill: '#E8E9EA' }} />} onClick={cancel} />
            <Button
                type="link"
                icon={
                    <SVGMic
                        volume={recorderStore.volume}
                        style={{ fill: '#E8E9EA' }}
                        isMuted={!devicesStore.audioOn}
                    />
                }
                onClick={switchMic}
            />
            <Button
                type="link"
                icon={<SVGCamera isMuted={!devicesStore.videoOn} style={{ fill: '#E8E9EA' }} />}
                onClick={switchCamera}
            />
        </div>
    )
})

export default ToolBox
