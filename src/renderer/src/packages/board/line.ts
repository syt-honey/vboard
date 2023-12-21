import { M, L, Q, mid } from './common'
import { Point } from './type'
import { BaseShape } from './base'

export class Line extends BaseShape {
    private last: Point | null = null
    private defn: string = ''
    private tail: number = 0

    constructor(path: SVGElement) {
        super(path)
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
