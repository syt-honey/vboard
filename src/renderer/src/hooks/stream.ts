import { useCallback, useMemo, useState } from 'react'

import { AudioAnalyser, getUserAudioStream } from '../utils'
import { useInterval } from '../hooks/interval'

export interface IAudioAnalyser {
    volume: number
    analyserInit: (id: string) => void
}
export const useAudioAnalyser = (): IAudioAnalyser => {
    const [stream, setStream] = useState<MediaStream | null>()
    const [volume, setVolume] = useState(0)

    const analyserInit = useCallback(
        (id: string): void => {
            const check = async (): Promise<void> => {
                const stream = await getUserAudioStream(id)
                if (stream.getAudioTracks().length > 0) {
                    setStream(stream)
                }
            }

            if (id) {
                check()
            }
        },
        [stream]
    )

    const analyser = useMemo(() => {
        return stream ? new AudioAnalyser(stream) : null
    }, [stream])

    useInterval(() => {
        if (analyser) {
            setVolume(analyser.getVolume())
        }
    }, 100)

    return { volume, analyserInit }
}
