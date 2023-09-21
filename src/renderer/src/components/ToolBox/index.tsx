import './index.css'

import { Button } from 'antd'
import { useMemo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { RecorderContext } from '../StoreProvider'
import { SVGResume, SVGPause, SVGCancel } from '../global'

export const ToolBox = observer(() => {
    const recorderStore = useContext(RecorderContext)
    const isRecording = useMemo(() => recorderStore.isRecording, [recorderStore.isRecording])

    return (
        <div className="tool-box">
            <Button
                type="link"
                className={`stop-btn ${isRecording ? 'stop-btn-recording' : 'stop-btn-pausing'}`}
                onClick={async (): Promise<void> => await recorderStore.stop()}
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
            <Button type="link" icon={<SVGCancel />} onClick={(): void => recorderStore.cancel()} />
        </div>
    )
})

export default ToolBox
