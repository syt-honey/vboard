import React, { createContext, FC } from 'react'
import { screenStore, recorderStore, devicesStore } from '../store'

export const RecorderContext = createContext(recorderStore)
export const ScreenContext = createContext(screenStore)
export const DevicesContext = createContext(devicesStore)

interface StoreProviderProps {
    children: React.ReactNode
}

export const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
    return (
        <RecorderContext.Provider value={recorderStore}>
            <ScreenContext.Provider value={screenStore}>
                <DevicesContext.Provider value={devicesStore}>{children}</DevicesContext.Provider>
            </ScreenContext.Provider>
        </RecorderContext.Provider>
    )
}
