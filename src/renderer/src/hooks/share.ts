import { useState, useEffect, useMemo } from 'react'

/**
 * share data between windows using localStorage
 * @param key storage name
 * @param callback
 * @returns
 */
type UseLocalStorageEventType<T> = {
    key: string
    defaultValues?: T
    LS_VERSION?: number
}
type UseLocalStorageEventReturnType<T> = [T, (newOptions: T, lv?: number) => void]

export function useLocalStorageEvent<T extends object>(
    options: UseLocalStorageEventType<T>,
    callback?: (arg: unknown) => void
): UseLocalStorageEventReturnType<T> {
    const { key, defaultValues, LS_VERSION } = options
    const [rawStore, setStore] = useState(() => localStorage.getItem(key) || `[null, '{}']`)
    const [v, store] = useMemo<[number, T]>(() => JSON.parse(rawStore), [rawStore])

    useEffect(() => {
        // If there are `defaultValues` and the key length of `store` is 0, we should initial store first.
        if (!Object.keys(store).length && defaultValues) {
            updateStore(defaultValues, LS_VERSION)
        }
    }, [])

    const updateStore = (newOptions: T, lv?: number): void => {
        const opts = JSON.stringify([lv ?? v, { ...newOptions }])
        localStorage.setItem(key, opts)
        setStore(opts)
    }

    useEffect(() => {
        const handleStorageChange = (event): void => {
            if (event.key === key) {
                setStore(event.newValue)
                callback && callback(event.newValue)
            }
        }

        window.addEventListener('storage', handleStorageChange)

        return (): void => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [key, callback])

    return [store, updateStore]
}

export default useLocalStorageEvent
