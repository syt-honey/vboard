import { M, L, Q, mid } from './common'

export class Path {
    path: SVGEllipseElement
    last: { x: number; y: number } | null
    tail: number
    defn: string

    constructor(path) {
        this.path = path
        this.last = null // previous point
        this.tail = 0 // length of the last "L(lastpoint)" string
        this.defn = '' // the "d" of <path>
    }

    remove(): void {
        this.path.remove()
    }

    update(point): void {
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
