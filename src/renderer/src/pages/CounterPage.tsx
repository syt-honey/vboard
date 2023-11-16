import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { ipcCloseCounterWindow, ipcCreateRecordingWindow, ipcCloseRecordingWindow } from '../utils'
import { CountDown } from '../components'

export const CounterPage = observer<React.FC>(() => {
    useEffect(() => {
        ipcCreateRecordingWindow({ url: '/recording' })

        return (): void => {
            ipcCloseRecordingWindow()
        }
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
