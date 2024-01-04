import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import useLocalStorageState from 'electron-localstorage-store'
import React, { useContext, useEffect, useCallback, useMemo, useState } from 'react'

import { CameraPage } from './CameraPage'
import { DevicesTypeValue } from '@renderer/store'

import { useAudioAnalyser } from '@renderer/hooks'
import { BoardStoreName, BoardStoreOptionsType, defaultBoard } from './board'
import {
    ipcCloseRecordingWindow,
    ipcShowMainWindow,
    ipcSyncByApp,
    ipcCreateBoardWindow,
    ipcCloseBoardWindow,
    ipcCloseBoardToolWindow
} from '@renderer/utils'
import {
    RecorderContext,
    ScreenContext,
    DevicesContext,
    PermissionContext,
    ToolBox
} from '@renderer/components'

export const RecordingPage = observer<React.FC>(() => {
    const recorderStore = useContext(RecorderContext)
    const screenStore = useContext(ScreenContext)
    const devicesStore = useContext(DevicesContext)
    const permissionStore = useContext(PermissionContext)

    const { analyserInit, volume } = useAudioAnalyser()
    const { t } = useTranslation()

    const { handleDevicesStatusUpdate, videoOn, selectedVideoInput } = devicesStore
    const [pageLoading, setPageLoading] = useState(false)
    const [boardOpened, setBoardOpened] = useState(false)
    const showCameraPage = useMemo(
        () => videoOn && selectedVideoInput,
        [videoOn, selectedVideoInput]
    )

    const [, , resetStore] = useLocalStorageState<BoardStoreOptionsType>({
        key: BoardStoreName,
        defaultValue: defaultBoard
    })

    useEffect(() => {
        setPageLoading(true)
        const checkScreen = async (): Promise<void> => {
            if (!screenStore.getScreen()) {
                await screenStore.initScreen()
                if (screenStore.getScreen()) {
                    recorderStore.setId(screenStore.getScreen().id)
                }

                const startRecording = async (): Promise<void> => {
                    if (recorderStore.isIdle) {
                        await recorderStore.start()

                        if (!screenStore.primaryDisplay) {
                            screenStore.initScreenPrimaryDisplay()
                        }
                    }
                    setPageLoading(false)
                }

                startRecording()
            }
        }

        checkScreen()

        return (): void => setPageLoading(false)
    }, [])

    useEffect(() => {
        if (devicesStore.audioOn && devicesStore.selectedAudioInput) {
            analyserInit(devicesStore.selectedAudioInput)
        }
    }, [devicesStore.audioOn])

    const handleFinish = useCallback(async () => {
        if (boardOpened) {
            handleBoardSwitch()
        }

        if (await recorderStore.finish()) {
            recorderStore.destroyed()

            ipcCloseRecordingWindow()
            ipcShowMainWindow()
        }
    }, [recorderStore, boardOpened])

    const handleCancel = useCallback(async () => {
        if (boardOpened) {
            handleBoardSwitch()
        }

        if (
            await ipcSyncByApp('confirmDialog', {
                title: t('cancelRecordering.title'),
                message: t('cancelRecordering.message'),
                buttons: [t('cancelRecordering.confirmBtn'), t('cancelRecordering.cancelBtn')]
            })
        ) {
            recorderStore.cancel()
            recorderStore.destroyed()

            ipcCloseRecordingWindow()
            ipcShowMainWindow()
        }
    }, [recorderStore, boardOpened])

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

    const handleBoardSwitch = useCallback((): void => {
        if (boardOpened) {
            resetStore()

            ipcCloseBoardWindow()
            ipcCloseBoardToolWindow()
        } else {
            ipcCreateBoardWindow({ url: '/board' })
        }

        setBoardOpened(!boardOpened)
    }, [boardOpened])

    return (
        <div className="recording-page">
            <ToolBox
                loading={pageLoading}
                volume={volume}
                devicesStore={devicesStore}
                recorderStore={recorderStore}
                boardOpened={boardOpened}
                handleFinish={handleFinish}
                handleCancel={handleCancel}
                handlePause={handlePause}
                handleResume={handleResume}
                handleMicSwitch={handleMicSwitch}
                handleCameraSwitch={handleCameraSwitch}
                handleBoardSwitch={handleBoardSwitch}
            />

            {showCameraPage && (
                <CameraPage
                    selectedVideoInput={devicesStore.selectedVideoInput!}
                    updateVideoPermission={permissionStore.updateVideoPermission}
                ></CameraPage>
            )}
        </div>
    )
})

export default RecordingPage
