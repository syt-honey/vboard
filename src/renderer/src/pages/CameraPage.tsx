import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import { Camera } from '../components'
import { getUserCameraStream } from '../utils'

export const CameraPage = observer<React.FC>(() => {
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

    useEffect(() => {
        ;(async function (): Promise<void> {
            const stream = await getUserCameraStream()
            setCameraStream(stream)
        })()
    }, [])

    return (
        <div className="camera-page">
            <Camera stream={cameraStream} shape={'rect'} />
        </div>
    )
})

export default CameraPage
