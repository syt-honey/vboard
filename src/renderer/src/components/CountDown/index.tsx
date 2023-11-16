import './index.css'

import React, { useState } from 'react'
import useInterval from '../../hooks/interval'

const COUNTDOWN = 3

interface CountDownProps {
    finished: () => void
}

export const CountDown: React.FC<CountDownProps> = ({ finished }: CountDownProps) => {
    const [count, setCount] = useState(COUNTDOWN)

    useInterval(() => {
        const n = count - 1
        if (n === 0) {
            finished()
            return
        }
        setCount(n)
    })

    return <div className="count-down">{count}</div>
}

export default CountDown
