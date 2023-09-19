import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { ipcCreateSubWindow, ipcHideMainWindow } from '../utils/ipc'

export const HomePage = observer<React.FC>(() => {
    const callRecording = (): void => {
        ipcHideMainWindow()
        ipcCreateSubWindow({ url: '/recording' })
    }

    return (
        <div className="container">
            <Button onClick={callRecording}>Start</Button>
        </div>
    )
})

export default HomePage
