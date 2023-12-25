const MAX_POSSIBLE_VOLUME = 255 / 4

/**
 * AudioAnalyser
 */
export class AudioAnalyser {
    private _analyser: AnalyserNode
    private _dataArray: Uint8Array

    constructor(_stream: MediaStream) {
        const audioContext = new AudioContext()
        this._analyser = audioContext.createAnalyser()
        this._analyser.fftSize = 256

        const source = audioContext.createMediaStreamSource(_stream)
        source.connect(this._analyser)

        const bufferLength = this._analyser.frequencyBinCount
        this._dataArray = new Uint8Array(bufferLength)
    }

    // get volume from 0 to 1
    getVolume(): number {
        this._analyser.getByteFrequencyData(this._dataArray)

        const v =
            this._dataArray.reduce((acc, val) => acc + val, 0) /
            this._dataArray.length /
            MAX_POSSIBLE_VOLUME
        return v > 1 ? 1 : v
    }
}
