import { M, L, Q, mid } from './common'
import { Point } from './type'
import { BaseShape } from './base'

export class Line extends BaseShape {
    last: Point | null
    tail: number
    defn: string

    constructor(path: SVGElement) {
        super(path)

        this.last = null // previous point
        this.tail = 0 // length of the last "L(lastpoint)" string
        this.defn = '' // the "d" of <path>
    }

    update(point: Point): void {
        if (this.last) {
            if (this.tail) {
                this.defn = this.defn.slice(0, -this.tail)
                this.defn += Q(this.last, mid(this.last, point))
            } else {
                this.defn += L(mid(this.last, point))
            }
            const tail = L(point)
            this.tail = tail.length
            this.defn += tail
            this.path.setAttribute('d', this.defn)
            this.last = point
        } else {
            this.defn = M((this.last = point))
        }
    }
}
