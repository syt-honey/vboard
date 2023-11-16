import { useRef, useEffect } from 'react'

type Callback = () => void

export const useInterval = (callback: Callback, timer?: number): void => {
    const savedCallback = useRef<Callback | null>(null)

    useEffect(() => {
        savedCallback.current = callback
    })

    useEffect(() => {
        function tick(): void {
            if (savedCallback.current) {
                savedCallback.current()
            }
        }

        const id = setInterval(tick, timer || 1000)
        return () => clearInterval(id)
    }, [])
}

export default useInterval
