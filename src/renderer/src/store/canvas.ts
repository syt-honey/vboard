export class PlayerCanvas {
    private _CAMERA_VIDEO_WIDTH: number
    private _CAMERA_VIDEO_HEIGHT: number

    private _canvas: HTMLCanvasElement
    private _canvasWidth: number
    private _canvasHeight: number
    private _context2d: CanvasRenderingContext2D | null
    private _screenVideo: HTMLVideoElement | null = null
    private _cameraVideo: HTMLVideoElement | null = null
    private _requestAnimationId: number | null = null

    constructor(width = 3072, height = 1920) {
        this._canvas = document.createElement('canvas')
        this._canvas.width = width
        this._canvas.height = height
        this._canvasWidth = width
        this._canvasHeight = height
        this._CAMERA_VIDEO_WIDTH = 400
        this._CAMERA_VIDEO_HEIGHT = 300

        this._context2d = this._canvas.getContext('2d')

        if (!this._requestAnimationId) {
            this._requestAnimationId = requestAnimationFrame(this._animationFrameHandler.bind(this))
        }
    }

    public setScreenVideo(video: HTMLVideoElement): void {
        this._screenVideo = video
    }

    public setCameraVideo(video: HTMLVideoElement): void {
        this._cameraVideo = video
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas
    }

    public stop(): void {
        this._requestAnimationId && cancelAnimationFrame(this._requestAnimationId)
    }

    private _animationFrameHandler(): void {
        if (this._screenVideo && this._context2d) {
            this._context2d.clearRect(0, 0, this._canvasWidth, this._canvasHeight)
            this._context2d.drawImage(
                this._screenVideo,
                0,
                0,
                this._canvasWidth,
                this._canvasHeight
            )
        }

        if (this._cameraVideo && this._context2d) {
            this._context2d.drawImage(
                this._cameraVideo,
                this._canvasWidth - this._CAMERA_VIDEO_WIDTH,
                this._canvasHeight - this._CAMERA_VIDEO_HEIGHT,
                this._CAMERA_VIDEO_WIDTH,
                this._CAMERA_VIDEO_HEIGHT
            )
        }

        this._requestAnimationId = requestAnimationFrame(this._animationFrameHandler.bind(this))
    }
}
