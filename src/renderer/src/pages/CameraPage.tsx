import { observer } from 'mobx-react-lite'
import React, { useState, useEffect, useCallback, useMemo } from 'react'

import { getUserCameraStream } from '../utils'
import { WindowType } from '@renderer/types/window'
import { ChildWindow } from '../components/ChildWindow'
import { Camera as CameraContent } from '../components/Camera'

export interface CameraPageProps {
    position?: { x?: number; y?: number }
    selectedVideoInput: string
    updateVideoPermission: (status: boolean) => void
    onCameraFinished?: () => void
}

export const CAMERA_WINDOW_ID = 'camera'

export const CameraPage = observer(
    ({
        position,
        selectedVideoInput,
        updateVideoPermission,
        onCameraFinished
    }: CameraPageProps): React.ReactElement => {
        const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
        const x = useMemo(() => position?.x || 0, [position?.x])
        const y = useMemo(() => position?.y || 0, [position?.y])

        useEffect(() => {
            return () => {
                if (cameraStream) {
                    cameraStream.getTracks().forEach((t) => {
                        t.stop()
                    })
                }
            }
        }, [cameraStream])

        const onClosed = (): void => {
            // to close page
        }

        const onFinished = useCallback(async (): Promise<void> => {
            try {
                // call camera permission when child window has been created
                setCameraStream(await getUserCameraStream(selectedVideoInput))
                updateVideoPermission(true)
            } catch (err) {
                // permission denied
                updateVideoPermission(false)
            }
        }, [selectedVideoInput])

        return (
            <ChildWindow
                type={WindowType.CAMERA}
                x={x}
                y={y}
                height={200}
                width={200}
                frame={false}
                alwaysOnTop
                transparent
                resizable={false}
                title={CAMERA_WINDOW_ID}
                onClosed={onClosed}
                onFinished={onFinished}
            >
                <CameraContent stream={cameraStream} shape={'rect'} onFinished={onCameraFinished} />
            </ChildWindow>
        )
    }
)

export default CameraPage
