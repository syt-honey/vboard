import { Button } from 'antd'
import { useContext, useState, useEffect, useMemo } from 'react'
import { RecorderContext, MediaContext } from './components/StoreProvider'
import { observer } from 'mobx-react-lite'
// import { ipcHideMainWindow } from './utils/ipc'

export const App = observer<JSX.Element>(function App() {
    const recorderStore = useContext(RecorderContext)
    const mediaStore = useContext(MediaContext)
    const [media, setMedia] = useState<Electron.DesktopCapturerSource | null>(null)

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

    const text = useMemo(() => (recorderStore.isIdle ? 'Start' : 'Stop'), [recorderStore.isIdle])

    const callRecording = async (): Promise<void> => {
        if (recorderStore.isIdle) {
            // ipcHideMainWindow()
            // ipcCreateWindow()
            await recorderStore.start()
        } else {
            recorderStore.stop()
        }
    }

    return (
        <div className="container">
            <Button onClick={callRecording} disabled={recorderStore.isPending}>
                {text}
            </Button>

            <video width="400" height="300" id="preview" autoPlay></video>
        </div>
    )
})

export default App
