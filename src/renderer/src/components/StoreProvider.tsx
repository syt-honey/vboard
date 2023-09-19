import React, { createContext, FC } from 'react'
import { mediaStore, recorderStore } from '../store'

export const RecorderContext = createContext(recorderStore)
export const MediaContext = createContext(mediaStore)

interface StoreProviderProps {
    children: React.ReactNode
}

export const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
    return (
        <RecorderContext.Provider value={recorderStore}>
            <MediaContext.Provider value={mediaStore}>{children}</MediaContext.Provider>
        </RecorderContext.Provider>
    )
}
