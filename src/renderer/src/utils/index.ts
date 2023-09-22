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
