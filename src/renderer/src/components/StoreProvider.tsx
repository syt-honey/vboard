import React, { createContext, FC } from 'react'
import { mediaStore, recorderStore, devicesStore } from '../store'

export const RecorderContext = createContext(recorderStore)
export const MediaContext = createContext(mediaStore)
export const DevicesContext = createContext(devicesStore)

interface StoreProviderProps {
    children: React.ReactNode
}

export const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
    return (
        <RecorderContext.Provider value={recorderStore}>
            <MediaContext.Provider value={mediaStore}>
                <DevicesContext.Provider value={devicesStore}>{children}</DevicesContext.Provider>
            </MediaContext.Provider>
        </RecorderContext.Provider>
    )
}
