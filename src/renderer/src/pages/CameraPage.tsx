import { observer } from 'mobx-react-lite'
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react'

import { ScreenContext } from '../components/StoreProvider'
import { getUserCameraStream } from '../utils'
import { WindowType } from '@renderer/types/window'
import { ChildWindow } from '../components/ChildWindow'
import { Camera } from '../components/Camera'

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
        const screenStore = useContext(ScreenContext)
        const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

        const x = useMemo(() => position?.x || 0, [position?.x])
        const y = useMemo(() => {
            {
                if (position?.y) return position.y

                const h = screenStore.primaryDisplay?.workAreaSize.height || 0
                return h ? h - 200 : 0
            }
        }, [screenStore.primaryDisplay, position?.y])

        useEffect(() => {
            if (!screenStore.primaryDisplay) {
                screenStore.initScreenPrimaryDisplay()
            }
        }, [])

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
                <Camera stream={cameraStream} shape={'rect'} onFinished={onCameraFinished} />
            </ChildWindow>
        )
    }
)

export default CameraPage
