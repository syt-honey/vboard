import { M, L } from './common'
import { Point } from './type'
import { BaseShape } from './base'

export class Rect extends BaseShape {
    start: Point | null
    defn: string

    constructor(path: SVGElement) {
        super(path)
        this.start = null
        this.defn = '' // the "d" of <path>
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
