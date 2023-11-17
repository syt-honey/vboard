import React, { useContext, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'

import { RecorderContext, ScreenContext, DevicesContext, ToolBox } from '../components'
import { DevicesTypeValue } from '../store'
import { useAudioAnalyser } from '../hooks'
import {
    ipcCloseCameraWindow,
    ipcCreateCameraWindow,
    ipcCloseRecordingWindow,
    ipcShowMainWindow,
    ipcSyncByApp
} from '../utils'

export const RecordingPage = observer<React.FC>(() => {
    const recorderStore = useContext(RecorderContext)
    const screenStore = useContext(ScreenContext)
    const devicesStore = useContext(DevicesContext)

    const { analyserInit, volume } = useAudioAnalyser()

    const { t } = useTranslation()
    const { handleDevicesOn } = devicesStore

    useEffect(() => {
        const checkScreen = async (): Promise<void> => {
            if (!screenStore.getScreen()) {
                await screenStore.initScreen()
                if (screenStore.getScreen()) {
                    recorderStore.setId(screenStore.getScreen().id)
                }

                const startRecording = async (): Promise<void> => {
                    if (recorderStore.isIdle) {
                        await recorderStore.start()
                    }
                }

                startRecording()
            }
        }

        checkScreen()
    }, [])

    useEffect(() => {
        if (devicesStore.videoOn) {
            ipcCreateCameraWindow({ url: '/camera' })
        }

        return (): void => ipcCloseCameraWindow()
    }, [devicesStore.videoOn])

    useEffect(() => {
        if (devicesStore.audioOn && devicesStore.selectedAudioInput) {
            analyserInit(devicesStore.selectedAudioInput)
        }
    }, [devicesStore.audioOn])

    const handleFinish = useCallback(async () => {
        if (await recorderStore.finish()) {
            recorderStore.destroyed()

            ipcCloseRecordingWindow()
            ipcCloseCameraWindow()
            ipcShowMainWindow()
        }
    }, [recorderStore])

    const handleCancel = useCallback(async () => {
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

    const handlePause = useCallback(() => {
        recorderStore.pause()
    }, [recorderStore])

    const handleResume = useCallback(() => {
        recorderStore.resume()
    }, [recorderStore])

    const handleMicSwitch = useCallback(async () => {
        await handleDevicesOn(!devicesStore.audioOn, DevicesTypeValue.AUDIO_INPUT)

        if (devicesStore.audioOn) {
            recorderStore.unmuteAudio()
        } else {
            recorderStore.muteAudio()
        }
    }, [devicesStore.audioOn])

    const handleCameraSwitch = useCallback(async () => {
        await handleDevicesOn(!devicesStore.videoOn, DevicesTypeValue.VIDEO_INPUT)

        if (devicesStore.videoOn) {
            ipcCreateCameraWindow({ url: '/camera' })
        } else {
            ipcCloseCameraWindow()
        }
    }, [devicesStore.videoOn])

    return (
        <div className="recording-page">
            <ToolBox
                volume={volume}
                devicesStore={devicesStore}
                recorderStore={recorderStore}
                handleFinish={handleFinish}
                handleCancel={handleCancel}
                handlePause={handlePause}
                handleResume={handleResume}
                handleMicSwitch={handleMicSwitch}
                handleCameraSwitch={handleCameraSwitch}
            />
        </div>
    )
})

export default RecordingPage
