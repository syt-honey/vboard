import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { RecorderContext, MediaContext, DevicesContext, ToolBox } from '../components'
import { ipcCloseCameraWindow, ipcCreateCameraWindow } from '@renderer/utils'

export const RecordingPage = observer<React.FC>(() => {
    const recorderStore = useContext(RecorderContext)
    const mediaStore = useContext(MediaContext)
    const devicesStore = useContext(DevicesContext)

    useEffect(() => {
        if (devicesStore.videoOn) {
            ipcCreateCameraWindow({ url: '/camera' })
        }

        return (): void => ipcCloseCameraWindow()
    }, [devicesStore.videoOn])

    useEffect(() => {
        const checkMedia = async (): Promise<void> => {
            if (!mediaStore.getMedia()) {
                await mediaStore.initMedia()
                if (mediaStore.getMedia()) {
                    recorderStore.setId(mediaStore.getMedia().id)
                }

                const startRecording = async (): Promise<void> => {
                    if (recorderStore.isIdle) {
                        await recorderStore.start()
                    }
                }

                startRecording()
            }
        }

        checkMedia()
    }, [])

    return (
        <div className="recording-page">
            <ToolBox recorderStore={recorderStore} />
        </div>
    )
})

export default RecordingPage
