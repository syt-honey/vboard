import { useState } from 'react'
import { ipcCloseWindow } from '../utils/ipc'

export const CountDown = function App(): JSX.Element {
    const [count, setCount] = useState(3)

    const timer = setInterval(() => {
        setCount(count - 1)
        if (count < 0) {
            clearInterval(timer)
            ipcCloseWindow()
        }
    }, 1000)

    return (
        <div className="recording-container">
            <div>{count}</div>
        </div>
    )
}

export default CountDown
