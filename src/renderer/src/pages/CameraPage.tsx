import { observer } from 'mobx-react-lite'
import React, { useEffect, useState, useContext } from 'react'

import { Camera } from '../components'
import { getUserCameraStream } from '../utils'
import { PermissionContext, DevicesContext } from '../components/StoreProvider'

export const CameraPage = observer<React.FC>(() => {
    const devicesStore = useContext(DevicesContext)
    const permissionStore = useContext(PermissionContext)
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

    useEffect(() => {
        if (devicesStore.selectedVideoInput) {
            try {
                ;(async function (): Promise<void> {
                    setCameraStream(await getUserCameraStream(devicesStore.selectedVideoInput))
                })()
                permissionStore.updateVideoPermission(true)
            } catch (err) {
                // permission denied
                permissionStore.updateVideoPermission(false)
            }
        }
    }, [devicesStore.selectedVideoInput, permissionStore.videoPermission])

    return (
        <div className="camera-page">
            <Camera stream={cameraStream} shape={'rect'} />
        </div>
    )
})

export default CameraPage
