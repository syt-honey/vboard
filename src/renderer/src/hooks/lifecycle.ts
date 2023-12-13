import { useEffect, useRef } from 'react'

export const useUnmount = (callback): void => {
    useEffect(() => {
        return (): void => {
            if (typeof callback === 'function') {
                callback()
            }
        }
    }, [callback])
}

// export const useMount = (call)

export const useChangesEffect = (callback, dependencies): void => {
    const isInitialMount = useRef(true)

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
        } else {
            if (typeof callback === 'function') {
                callback()
            }
        }
    }, dependencies)
}
