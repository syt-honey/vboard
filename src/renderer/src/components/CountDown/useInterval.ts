import { useRef, useEffect } from 'react'

type Callback = () => void

const useInterval = (callback: Callback): void => {
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

        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])
}

export default useInterval
