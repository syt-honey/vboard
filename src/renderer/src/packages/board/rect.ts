import { M, L } from './common'
import { Point } from './type'
import { BaseShape } from './base'

export class Rect extends BaseShape {
    private start: Point | null = null
    private defn: string = '' // the "d" of <path>

    constructor(path: SVGElement) {
        super(path)
    }

    update(point: Point): void {
        if (this.start) {
            this.defn = `${
                M(this.start) +
                L({ x: point.x, y: this.start.y }) +
                L({ x: point.x, y: point.y }) +
                L({ x: this.start.x, y: point.y })
            }Z`

            this.path.setAttribute('d', this.defn)
        } else {
            this.start = point
        }
    }
}
