import React, { createContext, FC } from 'react'
import { screenStore, recorderStore, devicesStore, permissionStore } from '@renderer/store'

export const RecorderContext = createContext(recorderStore)
export const ScreenContext = createContext(screenStore)
export const DevicesContext = createContext(devicesStore)
export const PermissionContext = createContext(permissionStore)

interface StoreProviderProps {
    children: React.ReactNode
}

export const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
    return (
        <RecorderContext.Provider value={recorderStore}>
            <ScreenContext.Provider value={screenStore}>
                <DevicesContext.Provider value={devicesStore}>
                    <PermissionContext.Provider value={permissionStore}>
                        {children}
                    </PermissionContext.Provider>
                </DevicesContext.Provider>
            </ScreenContext.Provider>
        </RecorderContext.Provider>
    )
}
