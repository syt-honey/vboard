import { makeAutoObservable, runInAction } from 'mobx'
import { getUserAudioStream, getUserScreenStream, ipcSyncByApp, AudioAnalyser } from '../utils'
import '../../../../lib/fix-webm-duration'

export class Recorder {
    private readonly miniType: string = 'video/webm'

    public timerId: NodeJS.Timeout | null = null

    private id: string = ''
    private recorder: MediaRecorder | null = null

    // save audio/video & screen stream
    private chunks: Blob[] = []

    // indicate recorder status
    private status: RecorderStatus = RecorderStatus.Idle

    private analyser: AudioAnalyser | null = null
    public volume: number = 0

    public startTime: number = 0
    public endTime: number = 0
    // duration of the recording, unit: ms
    public _duration: number = 0

    public get duration(): number {
        return Math.floor(this._duration / 1000)
    }

    constructor() {
        makeAutoObservable(this)
    }

    public setId(id: string): void {
        this.id = id
    }

    public get isIdle(): boolean {
        return this.status === RecorderStatus.Idle
    }

    public get isRecording(): boolean {
        return this.status === RecorderStatus.Recording
    }

    public async start(): Promise<void> {
        this.startTime = 0
        this.chunks = []
        this.status = RecorderStatus.Starting

        this.recorder = await this.createRecorder()
        runInAction(() => {
            this.status = this.recorder ? RecorderStatus.Recording : RecorderStatus.Idle
        })
    }

    public pause(): void {
        if (this.recorder) {
            this.recorder.pause()
            this.status = RecorderStatus.Paused
        }
    }

    public resume(): void {
        if (this.recorder) {
            this.recorder.resume()
            this.status = RecorderStatus.Recording

            this.startTime = Date.now()
            this.endTime = this._duration
        }
    }

    // cancel recording
    public cancel(): void {
        if (this.recorder) {
            this.recorder.stream.getAudioTracks().forEach((t) => t.stop())
            this.recorder.stream.getVideoTracks().forEach((t) => t.stop())

            this.startTime = 0
            this._duration = 0
        }
    }

    public async finish(): Promise<boolean> {
        if (this.recorder) {
            this.status = RecorderStatus.Saving
            this.recorder.stream.getAudioTracks().forEach((t) => t.stop())
            this.recorder.stream.getVideoTracks().forEach((t) => t.stop())

            return await this.saveMedia(new Blob([...this.chunks], { type: this.miniType }))
        }
        return false
    }

    public muteAudio(): void {
        if (this.recorder) {
            this.recorder.stream.getAudioTracks().forEach((t) => (t.enabled = false))
        }
    }

    public unmuteAudio(): void {
        if (this.recorder) {
            this.recorder.stream.getAudioTracks().forEach((t) => (t.enabled = true))
        }
    }

    private async createRecorder(): Promise<MediaRecorder | null> {
        try {
            const recorder = new MediaRecorder(
                new MediaStream([
                    ...(await getUserAudioStream()).getAudioTracks(),
                    ...(await getUserScreenStream(this.id)).getVideoTracks()
                ]),
                {
                    audioBitsPerSecond: 128000,
                    videoBitsPerSecond: 2500000,
                    mimeType: this.miniType
                }
            )

            runInAction(() => {
                this.startTime = Date.now()
            })

            this.timerId = setInterval(() => {
                runInAction(() => {
                    if (this.status === RecorderStatus.Recording) {
                        this._duration = this.endTime + Date.now() - this.startTime
                    }
                })
            }, 1000)

            recorder.onstart = (): void => {
                this.analyser = new AudioAnalyser(recorder.stream)
            }

            recorder.start(1000)
            recorder.ondataavailable = this.dataAvailable.bind(this)
            recorder.onstop = (): void => {
                runInAction(() => {
                    this.status = RecorderStatus.Idle
                })
            }

            return recorder
        } catch (e) {
            // not support
            console.error(e)
            return null
        }
    }

    private dataAvailable(event): void {
        if (event.data.size > 0) {
            const reader = new FileReader()
            reader.onload = (): void => {
                runInAction(() => {
                    this.volume = this.analyser!.getVolume()
                })
            }
            reader.readAsArrayBuffer(event.data)

            console.log(`[vboard]: start to save chuncks every 5s...., size: ${event.data.size}`)
            this.chunks.push(event.data)
        }
    }

    private async saveMedia(blob: Blob): Promise<boolean> {
        try {
            const fixedBlob = await window.ysFixWebmDuration?.(blob, this._duration)

            if (fixedBlob) {
                const arrayBuffer = await fixedBlob.arrayBuffer()
                return await ipcSyncByApp('save-file', {
                    arrayBuffer,
                    name: `vboard-${Date.now()}.webm`
                })
            }

            this._duration = 0
            this.startTime = 0

            return true
        } catch {
            return false
        }
    }

    public destroyed(): void {
        this.timerId && clearTimeout(this.timerId)

        if (this.recorder) {
            this.recorder.stream.getAudioTracks().forEach((t) => t.stop())
            this.recorder.stream.getVideoTracks().forEach((t) => t.stop())
        }
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
