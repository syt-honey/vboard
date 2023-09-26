import { makeAutoObservable, runInAction } from 'mobx'
import { getUserAudioStream, getUserScreenStream, ipcSyncByApp } from '../utils'
import '../../../../lib/fix-webm-duration'

export class Recorder {
    private readonly miniType: string = 'video/webm'

    private _id: string = ''
    private _recorder: MediaRecorder | null = null

    // save audio/video & screen stream
    private _chunks: Blob[] = []

    // indicate recorder status
    private _status: RecorderStatus = RecorderStatus.Idle

    public startTime: number = 0

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

    // @TODO: we should clear all status before starting recording
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
        runInAction(() => {
            this._status = RecorderStatus.Idle
        })
    }

    public async stop(): Promise<void> {
        if (this._recorder) {
            this._recorder.stream.getAudioTracks().forEach((t) => t.stop())
            this._recorder.stream.getVideoTracks().forEach((t) => t.stop())
        }
    }

    private async _createRecorder(): Promise<MediaRecorder | null> {
        return new Promise((resolve, reject) => {
            try {
                ;(async (): Promise<void> => {
                    const _recorder = new MediaRecorder(
                        new MediaStream([
                            ...(await getUserAudioStream()).getAudioTracks(),
                            ...(await getUserScreenStream(this._id)).getVideoTracks()
                        ]),
                        {
                            audioBitsPerSecond: 128000,
                            videoBitsPerSecond: 2500000,
                            mimeType: this.miniType
                        }
                    )
                    this.startTime = Date.now()
                    _recorder.start(5000)
                    _recorder.onerror = reject
                    _recorder.ondataavailable = this._dataAvailable.bind(this)
                    _recorder.onstop = this._stop.bind(this)
                    resolve(_recorder)
                })()
            } catch (e) {
                // not support
                console.error(e)
                resolve(null)
            }
        })
    }

    private _dataAvailable(e): void {
        if (e.data.size > 0) {
            console.log(`[vboard]: start to save chunck every 5s...., size: ${e.data.size}`)
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

    private _saveMedia(blob: Blob): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                ;(async (): Promise<void> => {
                    const duration = Date.now() - this.startTime
                    window.ysFixWebmDuration?.(blob, duration, async (fixedBlob) => {
                        const arrayBuffer = await fixedBlob.arrayBuffer()
                        await ipcSyncByApp('save-file', {
                            arrayBuffer,
                            name: `vboard-${Date.now()}.webm`
                        })
                        resolve(true)
                    })
                })()
            } catch (e) {
                console.error(e)
                reject(e)
            }
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
