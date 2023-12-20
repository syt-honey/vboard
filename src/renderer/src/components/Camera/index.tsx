import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useEffect, useState, useRef } from 'react'

const CameraContainer = styled.div`
    display: inline-block;
    height: 200px;
    width: 200px;
    line-height: 200px;
    text-align: center;
    overflow: hidden;
    box-sizing: border-box;
    -webkit-user-select: none;
    -webkit-app-region: drag;
`

const CameraPreview = styled.video`
    width: 267px;
    height: 200px;
    object-fit: cover;
`

export interface CameraProps {
    // support px and precent(%)
    width?: string
    height?: string
    // if shape equals 'circle' and the width and height are not equal,
    // then we will set width and height to the minimum value of them
    shape?: 'circle' | 'rect'
    stream: MediaStream | null
    onFinished?: () => void
}

// default camera ratio. we should use this ratio to calculate circle width
const RATIO = 4 / 3
const CIRCLE_WIDTH = '267px'

export const replaceDigital = (origin: string, v: string): string => {
    return origin.replace(/\d+/, v)
}

export const Camera = observer(
    ({ width = '200px', height = '200px', shape = 'circle', stream, onFinished }: CameraProps) => {
        const camera = useRef<HTMLVideoElement>(null)
        // keep default ratio
        const [videoStyle, setVideoStyle] = useState({ width, height })

        // clip a circle area if needed
        const [containerStyle, setContainerStyle] = useState({
            width,
            height,
            borderRadius: ''
        })

        useEffect(() => {
            if (stream) {
                onFinished?.()
            }
            if (camera.current && stream) {
                camera.current.srcObject = stream
                camera.current.play()
            }
        }, [stream])

        useEffect(() => {
            if (shape === 'circle') {
                width = CIRCLE_WIDTH
                const min = Math.ceil(Math.min(parseInt(width), parseInt(height)))

                setVideoStyle({
                    width: replaceDigital(videoStyle.width, Math.ceil(min * RATIO).toString()),
                    height: replaceDigital(videoStyle.height, min.toString())
                })
                setContainerStyle({
                    width: replaceDigital(containerStyle.width, min.toString()),
                    height: replaceDigital(containerStyle.height, min.toString()),
                    borderRadius: '50%'
                })
            }
        }, [shape, width, height])

        return (
            <CameraContainer style={{ ...containerStyle }}>
                <CameraPreview ref={camera} style={{ ...videoStyle }} autoPlay></CameraPreview>
            </CameraContainer>
        )
    }
)

export default Camera
