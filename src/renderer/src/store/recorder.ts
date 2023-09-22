import { makeAutoObservable, runInAction } from 'mobx'
import { getUserAudioStream, getUserScreenStream, ipcSyncByApp } from '../utils'

export class Recorder {
    private readonly miniType: string = 'video/webm'

    private _id: string = ''
    private _recorder: MediaRecorder | null = null

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

    public get isRecording(): boolean {
        return this._status === RecorderStatus.Recording
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

    public pause(): void {
        if (this._recorder) {
            this._recorder.pause()
            runInAction(() => {
                this._status = RecorderStatus.Paused
            })
        }
    }

    public resume(): void {
        if (this._recorder) {
            this._recorder.resume()
            runInAction(() => {
                this._status = RecorderStatus.Recording
            })
        }
    }

    public cancel(): void {
        if (this._recorder) {
            this._recorder.stream.getAudioTracks().forEach((t) => t.stop())
            this._recorder.stream.getVideoTracks().forEach((t) => t.stop())
        }

        this._id = ''
        this._recorder = null
        this._chunks = []

        runInAction(() => {
            this._status = RecorderStatus.Idle
        })
    }

    public async stop(): Promise<void> {
        if (this._recorder) {
            this._recorder.stream.getAudioTracks().forEach((t) => t.stop())
            this._recorder.stream.getVideoTracks().forEach((t) => t.stop())
        }

        this._id = ''
        this._recorder = null
        this._chunks = []
    }

    private async _createRecorder(): Promise<MediaRecorder | null> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const _recorder = new MediaRecorder(
                    new MediaStream([
                        ...(await getUserAudioStream()).getAudioTracks(),
                        ...(await getUserScreenStream(this._id)).getVideoTracks()
                    ]),
                    {
                        audioBitsPerSecond: 128000,
                        mimeType: this.miniType
                    }
                )
                _recorder.start(5000)
                _recorder.onerror = reject
                _recorder.ondataavailable = this._dataAvailable.bind(this)
                _recorder.onstop = this._stop.bind(this)

                resolve(_recorder)
            } catch (e) {
                // not support
                console.error(e)
                resolve(null)
            }
        })
    }

    // @FIXME: video will can not play when more than x chuncks
    private _dataAvailable(e): void {
        if (e.data.size > 0) {
            console.log(`start to save chunck every 5s...., size: ${e.data.size}`)
            this._chunks.push(e.data)
        }
    }

    private async _stop(): Promise<void> {
        runInAction(() => {
            this._status = RecorderStatus.Saving
        })
        await this._saveMedia(new Blob([...this._chunks], { type: this.miniType }))
        runInAction(() => {
            this._status = RecorderStatus.Idle
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
}

export enum RecorderStatus {
    Idle = 'Idle',
    Starting = 'Starting',
    Recording = 'Recording',
    Paused = 'Paused',
    Saving = 'Saving'
}

export const recorderStore = new Recorder()
