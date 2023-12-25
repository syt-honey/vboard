import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useMemo } from 'react'

import { CountDown } from '@renderer/components'
import { WindowType } from '@renderer/types/window'
import { ChildWindow } from '@renderer/components/ChildWindow'
import { ScreenContext } from '@renderer/components/StoreProvider'

export const COUNTDOWN_WINDOW_ID = 'count'

export interface CounterPageProps {
    onCounterMounted: () => void
    onCounterDownFinished: () => void
}

export const CounterPage = observer(
    ({ onCounterDownFinished, onCounterMounted }: CounterPageProps): React.ReactElement => {
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
                onFinished={onCounterMounted}
            >
                <CountDown finished={onCounterDownFinished} />
            </ChildWindow>
        )
    }
)

export default CounterPage
