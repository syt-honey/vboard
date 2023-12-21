import { BaseShape } from './base'
import { Point } from './type'

export class Ellipse extends BaseShape {
    private start: Point | null = null

    // cx, cy are the coordinates of the center of the ellipse
    // rx is the horizontal radius of the ellipse
    // ry is the vertical radius of the ellipse
    private cx: string = ''
    private cy: string = ''
    private rx: string = ''
    private ry: string = ''

    constructor(path: SVGElement) {
        super(path)
    }

    update(point: Point): void {
        if (this.start) {
            this.cx = String(this.start.x + (point.x - this.start.x) / 2)
            this.cy = String(this.start.y + (point.y - this.start.y) / 2)
            this.rx = String(Math.abs(point.x - this.start.x) / 2)
            this.ry = String(Math.abs(point.y - this.start.y) / 2)

            this.path.setAttribute('cx', this.cx)
            this.path.setAttribute('cy', this.cy)
            this.path.setAttribute('rx', this.rx)
            this.path.setAttribute('ry', this.ry)
        } else {
            this.start = point
        }
    }
}
