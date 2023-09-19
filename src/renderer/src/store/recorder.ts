import { ipcSyncByApp } from '../utils/ipc'
import { makeAutoObservable, runInAction } from 'mobx'
import { PlayerCanvas } from './canvas'

export class Recorder {
    private readonly miniType: string = 'video/webm;codecs=vp8,opus'

    private _id: string = ''
    private _recorder: MediaRecorder | null = null

    // save camera & screen stream for stop
    private _streamList: MediaStream[] = []

    // handle camera & screen stream to a single stream
    private _playerCanvas: PlayerCanvas | null = null

    // save audio/video & screen stream
    private _chunks: Blob[] = []

    // indicate recorder status
    private _status: RecorderStatus = RecorderStatus.Idle

    constructor() {
        makeAutoObservable(this)
    }

    public setId(id: string): void {
        this._id = id
    }

    public get isIdle(): boolean {
        return this._status === RecorderStatus.Idle
    }

    // we say pending status indicates starting to record or starting to save
    public get isPending(): boolean {
        return this._status === RecorderStatus.Starting || this._status === RecorderStatus.Saving
    }

    public async start(): Promise<void> {
        runInAction(() => {
            this._status = RecorderStatus.Starting
        })
        this._recorder = await this._createRecorder()
        runInAction(() => {
            this._status = this._recorder ? RecorderStatus.Recording : RecorderStatus.Idle
        })
    }

    public async stop(): Promise<void> {
        if (this._recorder && this._playerCanvas) {
            this._recorder.stream.getAudioTracks().forEach((t) => t.stop())
            this._streamList.forEach((s) => s.getTracks().forEach((t) => t.stop()))

            this._playerCanvas.stop()
            this._recorder.stop()
        }

        this._id = ''
        this._recorder = null
        this._chunks = []
        this._streamList = []
    }

    private async _createRecorder(): Promise<MediaRecorder | null> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            if (navigator.mediaDevices) {
                // main stream
                const stream = new MediaStream()
                const userCameraStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                })
                const userScreenStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: this._id
                        }
                    },
                    audio: false
                })
                const userAudioStream = await navigator.mediaDevices.getUserMedia({
                    video: false,
                    audio: true
                })

                this._playerCanvas = new PlayerCanvas()
                this._playerCanvas.setCameraVideo(this._createVideoEle(userCameraStream))
                this._playerCanvas.setScreenVideo(this._createVideoEle(userScreenStream))

                // merge canvas stream and audio stream to main stream
                this._playerCanvas.canvas
                    .captureStream(30)
                    .getTracks()
                    .forEach((t) => stream.addTrack(t))
                userAudioStream.getAudioTracks().forEach((t) => stream.addTrack(t))

                this._streamList.push(userCameraStream)
                this._streamList.push(userScreenStream)

                const video = document.getElementById('preview') as HTMLVideoElement
                if (video) {
                    video.srcObject = stream
                }

                const _recorder = new MediaRecorder(stream, { mimeType: this.miniType })
                _recorder.start(5000)
                _recorder.onerror = reject

                _recorder.ondataavailable = (e): void => {
                    if (e.data.size > 0) {
                        console.log(`start to save chunck every 5s...., size: ${e.data.size}`)
                        this._chunks.push(e.data)
                    }
                }

                _recorder.onstop = async (): Promise<void> => {
                    runInAction(() => {
                        this._status = RecorderStatus.Saving
                    })
                    await this._saveMedia(new Blob([...this._chunks], { type: this.miniType }))
                    runInAction(() => {
                        this._status = RecorderStatus.Idle
                    })
                }

                resolve(_recorder)
            }
            resolve(null)
        })
    }

    private _saveMedia(blob): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = async (): Promise<void> => {
                await ipcSyncByApp('save-file', {
                    stream: new Uint8Array(reader.result as ArrayBuffer),
                    name: `vboard-${(Math.random() * 10).toString().substring(5)}.webm`
                })
                resolve(true)
            }
            reader.onerror = reject
            reader.readAsArrayBuffer(blob)
        })
    }

    private _createVideoEle(stream: MediaStream): HTMLVideoElement {
        const video = document.createElement('video')
        video.autoplay = true
        video.srcObject = stream
        return video
    }
}

export enum RecorderStatus {
    Idle = 'Idle',
    Starting = 'Starting',
    Recording = 'Recording',
    Saving = 'Saving'
}

export const recorderStore = new Recorder()
