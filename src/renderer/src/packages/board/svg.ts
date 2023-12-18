// from: https://github.com/hyrious/ink

import { input } from './input'
import { mid } from './common'

function svg(tag = 'svg'): SVGElement {
    return document.createElementNS('http://www.w3.org/2000/svg', tag)
}

const M = ({ x, y }): string => `M${x.toFixed(2)},${y.toFixed(2)}`
const L = ({ x, y }): string => `L${x.toFixed(2)},${y.toFixed(2)}`
const Q = (c, { x, y }): string =>
    `Q${c.x.toFixed(2)},${c.y.toFixed(2)} ${x.toFixed(2)},${y.toFixed(2)}`
// const C = (c1, c2, { x, y }): string => `C${c1.x},${c1.y} ${c2.x},${c2.y} ${x} ${y}`

class Path {
    path: SVGPathElement
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
        // UN-OPTIMIZED:
        // const points = this.points;
        // points.push({ x, y });
        // if (points.length < 2) {
        //   this.path.setAttribute("d", "");
        // } else {
        //   const last = points.length - 1;
        //   let def = M(points[0]) + L(mid(points[0], points[1]));
        //   for (let i = 1; i < last; ++i) {
        //     def += Q(points[i], mid(points[i], points[i + 1]));
        //   }
        //   def += L(points[last]);
        //   this.path.setAttribute("d", def);
        // }

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

export const draw = (el: HTMLElement): void => {
    let path: Path | null = null
    input(el, {
        start() {
            path = new Path(svg('path'))
            if (el && path) {
                el.append(path.path)
            }
        },
        /** @param { PointerEvent } ev */
        update(ev) {
            const { offsetX: x, offsetY: y } = ev
            if (path) {
                path.update({ x, y })
            }
        },
        finish() {
            if (path && path.tail === 0) {
                path.remove()
            }
            path = null
        }
    })
}
