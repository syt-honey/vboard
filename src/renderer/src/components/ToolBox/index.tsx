import './index.css'

import { Button } from 'antd'
import { useMemo, useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import { RecorderContext } from '../StoreProvider'
import { SVGResume, SVGPause, SVGCancel } from '../global'
// import { ipcCloseCameraWindow, ipcCloseRecordingWindow } from '@renderer/utils'

export const ToolBox = observer(() => {
    const recorderStore = useContext(RecorderContext)
    const isRecording = useMemo(() => recorderStore.isRecording, [recorderStore.isRecording])

    // TODO: so messy, need to refactor
    const stop = useCallback(async () => {
        await recorderStore.stop()
        // ipcCloseRecordingWindow()
    }, [recorderStore])

    const pause = useCallback(async () => {
        recorderStore.pause()
    }, [recorderStore])

    const resume = useCallback(async () => {
        recorderStore.resume()
    }, [recorderStore])

    const cancel = useCallback(async () => {
        recorderStore.cancel()
        // ipcCloseCameraWindow()
        // ipcCloseRecordingWindow()
    }, [recorderStore])

    return (
        <div className="tool-box">
            <Button
                type="link"
                className={`stop-btn ${isRecording ? 'stop-btn-recording' : 'stop-btn-pausing'}`}
                onClick={stop}
            />
            <Button
                className="pause-btn"
                type="link"
                icon={isRecording ? <SVGPause /> : <SVGResume />}
                onClick={isRecording ? pause : resume}
            />
            <Button type="link" icon={<SVGCancel />} onClick={cancel} />
        </div>
    )
})

export default ToolBox
