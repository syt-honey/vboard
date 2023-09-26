import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { ipcCreateCounterWindow, ipcHideMainWindow } from '../utils/ipc'

export const HomePage = observer<React.FC>(() => {
    const { t } = useTranslation()

    const callRecording = (): void => {
        ipcHideMainWindow()
        ipcCreateCounterWindow({ url: '/counter' })
    }

    return (
        <div className="main-page">
            <Button onClick={callRecording}>{t('start')}</Button>
        </div>
    )
})

export default HomePage
