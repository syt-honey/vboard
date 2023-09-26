export * from './ipc'

export const getUserCameraStream = async (): Promise<MediaStream> => {
    const constraints: MediaStreamConstraints = {
        audio: false,
        video: true
    }

    return navigator.mediaDevices.getUserMedia(constraints)
}

export const getUserAudioStream = async (): Promise<MediaStream> => {
    const constraints: MediaStreamConstraints = {
        audio: true,
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
