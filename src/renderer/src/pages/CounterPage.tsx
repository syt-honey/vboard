import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useMemo } from 'react'

import { CountDown } from '../components'
import { WindowType } from '../types/window'
import { ChildWindow } from '../components/ChildWindow'
import { ScreenContext } from '../components/StoreProvider'

export const COUNTDOWN_WINDOW_ID = 'count'

export interface CounterPageProps {
    onCounterFinished: () => void
}

export const CounterPage = observer(
    ({ onCounterFinished }: CounterPageProps): React.ReactElement => {
        const screenStore = useContext(ScreenContext)

        // @TODO: need to cover full screen
        const size = useMemo(
            () => screenStore.primaryDisplay?.size || { width: 0, height: 0 },
            [screenStore.primaryDisplay?.size]
        )
        const y = useMemo(
            () => screenStore.primaryDisplay?.workArea.y || 0,
            [screenStore.primaryDisplay?.workArea.y]
        )

        useEffect(() => {
            if (!screenStore.primaryDisplay) {
                screenStore.initScreenPrimaryDisplay()
            }
        }, [])

        return (
            <ChildWindow
                type={WindowType.COUNTER}
                x={0}
                y={0}
                width={size?.width}
                height={size?.height - y}
                minHeight={size?.height - y}
                frame={false}
                alwaysOnTop
                transparent
                title={COUNTDOWN_WINDOW_ID}
            >
                <CountDown finished={onCounterFinished} />
            </ChildWindow>
        )
    }
)

export default CounterPage
