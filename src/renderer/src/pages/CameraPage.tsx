import { observer } from 'mobx-react-lite'
import React, { useState, useEffect, useCallback } from 'react'

import { getUserCameraStream } from '../utils'
import { WindowType } from '@renderer/types/window'
import { ChildWindow } from '../components/ChildWindow'
import { Camera as CameraContent } from '../components/Camera'

export interface CameraPageProps {
    selectedVideoInput: string
    updateVideoPermission: (status: boolean) => void
}

export const CAMERA_WINDOW_ID = 'camera'

export const CameraPage = observer(
    ({ selectedVideoInput, updateVideoPermission }: CameraPageProps): React.ReactElement => {
        const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

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
                x={0}
                y={200}
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
                <CameraContent stream={cameraStream} shape={'rect'} />
            </ChildWindow>
        )
    }
)

export default CameraPage
