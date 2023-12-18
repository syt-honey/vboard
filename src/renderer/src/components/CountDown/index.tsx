import styled from 'styled-components'
import React, { useState } from 'react'
import useInterval from '../../hooks/interval'

const CounterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    border: 3px solid #00ff00;
    border-radius: 8px;
    box-sizing: border-box;
    user-select: none;
    pointer-events: none;
`
const CounterText = styled.div`
    display: inline-block;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    border-radius: 50%;
    background-color: #121821;
    color: #fff;
    font-size: 60px;
`

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

    return (
        <CounterContainer>
            <CounterText>{count}</CounterText>
        </CounterContainer>
    )
}

export default CountDown
