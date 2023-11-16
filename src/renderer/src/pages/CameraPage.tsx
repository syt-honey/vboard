import React, { useEffect, useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Camera } from '../components'
import { getUserCameraStream } from '../utils'
import { DevicesContext } from '../components/StoreProvider'

export const CameraPage = observer<React.FC>(() => {
    const devicesStore = useContext(DevicesContext)
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

    useEffect(() => {
        ;(async function (): Promise<void> {
            setCameraStream(await getUserCameraStream(devicesStore.selectedVideoInput))
        })()
    }, [devicesStore.selectedVideoInput])

    return (
        <div className="camera-page">
            <Camera stream={cameraStream} shape={'rect'} />
        </div>
    )
})

export default CameraPage
