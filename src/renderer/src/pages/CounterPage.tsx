import React from 'react'
import { observer } from 'mobx-react-lite'

import { ipcCloseCounterWindow, ipcCreateRecordingWindow, ipcCreateCameraWindow } from '../utils'
import { CountDown } from '../components'

export const CounterPage = observer<React.FC>(() => {
    const handleFinish = (): void => {
        ipcCloseCounterWindow()
        ipcCreateRecordingWindow({ url: '/recording' })
        ipcCreateCameraWindow({ url: '/camera' })
    }

    return (
        <div className="counter-page">
            <CountDown finished={handleFinish} />
        </div>
    )
})

export default CounterPage
