import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import React, { useContext, useEffect, useCallback, useMemo } from 'react'

import { CameraPage } from './CameraPage'
import { DevicesTypeValue } from '../store'
import { useAudioAnalyser } from '../hooks'
import { ipcCloseRecordingWindow, ipcShowMainWindow, ipcSyncByApp } from '../utils'
import {
    RecorderContext,
    ScreenContext,
    DevicesContext,
    PermissionContext,
    ToolBox
} from '../components'

export const RecordingPage = observer<React.FC>(() => {
    const recorderStore = useContext(RecorderContext)
    const screenStore = useContext(ScreenContext)
    const devicesStore = useContext(DevicesContext)
    const permissionStore = useContext(PermissionContext)

    const { analyserInit, volume } = useAudioAnalyser()
    const { t } = useTranslation()

    const { handleDevicesStatusUpdate, videoOn, selectedVideoInput } = devicesStore

    const showTestPage = useMemo(() => videoOn && selectedVideoInput, [videoOn, selectedVideoInput])

    const cameraY = useMemo(() => {
        const h = screenStore.workArea?.workAreaSize.height || 0
        return h ? h - 200 : 0
    }, [screenStore.workArea])

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

        if (!screenStore.workArea) {
            screenStore.initScreenWorkArea()
        }

        checkScreen()
    }, [])

    useEffect(() => {
        if (devicesStore.audioOn && devicesStore.selectedAudioInput) {
            analyserInit(devicesStore.selectedAudioInput)
        }
    }, [devicesStore.audioOn])

    const handleFinish = useCallback(async () => {
        if (await recorderStore.finish()) {
            recorderStore.destroyed()

            ipcCloseRecordingWindow()
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

    const handleMicSwitch = useCallback(() => {
        handleDevicesStatusUpdate(!devicesStore.audioOn, DevicesTypeValue.AUDIO_INPUT)

        if (devicesStore.audioOn) {
            recorderStore.unmuteAudio()
        } else {
            recorderStore.muteAudio()
        }
    }, [devicesStore.audioOn])

    const handleCameraSwitch = useCallback(() => {
        handleDevicesStatusUpdate(!devicesStore.videoOn, DevicesTypeValue.VIDEO_INPUT)
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

            {showTestPage && (
                <CameraPage
                    position={{ y: cameraY }}
                    selectedVideoInput={devicesStore.selectedVideoInput!}
                    updateVideoPermission={permissionStore.updateVideoPermission}
                ></CameraPage>
            )}
        </div>
    )
})

export default RecordingPage
