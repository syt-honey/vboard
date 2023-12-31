export * from './ipc'
export * from './analyser'

export const getSystemDevices = async (): Promise<MediaDeviceInfo[]> => {
    return await navigator.mediaDevices.enumerateDevices()
}

export const getUserCameraStream = async (id: string | null): Promise<MediaStream> => {
    const constraints: MediaStreamConstraints = {
        audio: false,
        video: id ? { deviceId: id } : true
    }

    return navigator.mediaDevices.getUserMedia(constraints)
}

export const getUserAudioStream = async (id: string | null): Promise<MediaStream> => {
    const constraints: MediaStreamConstraints = {
        audio: id ? { deviceId: id } : true,
        video: false
    }

    return navigator.mediaDevices.getUserMedia(constraints)
}

export const getUserScreenStream = async (id: string): Promise<MediaStream> => {
    const constraints: MediaStreamConstraints = {
        video: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: id
            }
        },
        audio: false
    }

    return navigator.mediaDevices.getUserMedia(constraints)
}

export const mergeAudioStream = (userScreenStream, userAudioStream): MediaStreamTrack[] | [] => {
    const context = new AudioContext()
    const destination = context.createMediaStreamDestination()
    let hasAudio = false

    if (userScreenStream?.getAudioTracks().length > 0) {
        // If you don't want to share Audio from the desktop it should still work with just the voice.
        const screenSource = context.createMediaStreamSource(userScreenStream)
        const screenGain = context.createGain()
        screenGain.gain.value = 0.7
        screenSource.connect(screenGain).connect(destination)
        hasAudio = true
    }

    if (userAudioStream?.getAudioTracks().length > 0) {
        const audioSource = context.createMediaStreamSource(userAudioStream)
        const audioGain = context.createGain()
        audioGain.gain.value = 0.7
        audioSource.connect(audioGain).connect(destination)
        hasAudio = true
    }

    return hasAudio ? destination.stream.getAudioTracks() : []
}

export const formatSeconds = (secs: number): string => {
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString())

    const h = Math.floor(secs / 3600)
    const m = Math.floor(secs / 60) - h * 60
    const s = Math.floor(secs - h * 3600 - m * 60)

    return `${h > 0 ? pad(h) + ':' : ''}${pad(m)}:${pad(s)}`
}

export const generateUniqueFileName = (): string => {
    // ->2023-03-03vk4zbz
    return formatTimestamp() + randomString()
}

export const formatTimestamp = (): string => {
    const d = new Date()

    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
        .getDate()
        .toString()
        .padStart(2, '0')}`
}

export const randomString = (): string => {
    // ->vk4zbz
    return Math.random().toString(36).substring(2, 8)
}

export const sleep = (ms: number): Promise<NodeJS.Timeout> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
