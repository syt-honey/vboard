import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { ipcCloseCounterWindow, ipcCreateRecordingWindow, ipcCreateCameraWindow } from '../utils'
import { CountDown } from '../components'

export const CounterPage = observer<React.FC>(() => {
    useEffect(() => {
        ipcCreateRecordingWindow({ url: '/recording' })
        ipcCreateCameraWindow({ url: '/camera', isDelay: true })
    }, [])

    const handleFinish = (): void => {
        ipcCloseCounterWindow()
    }

    return (
        <div className="counter-page">
            <CountDown finished={handleFinish} />
        </div>
    )
})

export default CounterPage
