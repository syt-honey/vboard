import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { ipcCreateCounterWindow, ipcHideMainWindow } from '../utils/ipc'

export const HomePage = observer<React.FC>(() => {
    const callRecording = (): void => {
        ipcHideMainWindow()
        ipcCreateCounterWindow({ url: '/counter' })
    }

    return (
        <div className="main-page">
            <Button onClick={callRecording}>Start</Button>
        </div>
    )
})

export default HomePage
