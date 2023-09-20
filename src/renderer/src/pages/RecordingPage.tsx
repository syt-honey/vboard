import React, { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { RecorderContext, MediaContext, CountDown, ToolBox, Camera } from '../components'

const COUNTDOWN = 3

export const RecordingPage = observer<React.FC>(() => {
    const recorderStore = useContext(RecorderContext)
    const mediaStore = useContext(MediaContext)
    const [media, setMedia] = useState<Electron.DesktopCapturerSource | null>(null)
    const [count, setCount] = useState(COUNTDOWN)

    useEffect(() => {
        const checkMedia = async (): Promise<void> => {
            if (!mediaStore.getMedia()) {
                await mediaStore.initMedia()
                setMedia(mediaStore.getMedia())
                if (media) {
                    recorderStore.setId(media.id)
                }
            }
        }

        checkMedia()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setCount(count - 1)
            if (count < 0) {
                clearInterval(timer)
            }
        }, 1000)

        if (count < 0) {
            const startRecording = async (): Promise<void> => {
                if (recorderStore.isIdle) {
                    await recorderStore.start()
                }
            }
            startRecording()
        }

        return (): void => clearInterval(timer)
    }, [count])

    return (
        <div className="recording-border">
            {count > 0 ? (
                <CountDown count={count} />
            ) : (
                <>
                    <ToolBox />
                    <Camera />
                </>
            )}
        </div>
    )
})

export default RecordingPage
