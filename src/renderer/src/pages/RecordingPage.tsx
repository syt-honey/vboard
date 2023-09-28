import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { RecorderContext, MediaContext, ToolBox } from '../components'

export const RecordingPage = observer<React.FC>(() => {
    const recorderStore = useContext(RecorderContext)
    const mediaStore = useContext(MediaContext)

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
            <ToolBox />
        </div>
    )
})

export default RecordingPage
