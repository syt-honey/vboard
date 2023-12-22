import { Point } from './type'

export function mid(a, b): { x: number; y: number } {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

export const M = ({ x, y }): string => `M${x.toFixed(2)},${y.toFixed(2)}`
export const L = ({ x, y }): string => `L${x.toFixed(2)},${y.toFixed(2)}`
export const Q = (c, { x, y }): string =>
    `Q${c.x.toFixed(2)},${c.y.toFixed(2)} ${x.toFixed(2)},${y.toFixed(2)}`

export function svg(tag = 'svg'): SVGElement {
    return document.createElementNS('http://www.w3.org/2000/svg', tag)
}

// the distance between the given two points
export function distance(point1: Point, point2: Point): number {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
}

// the midpoint coordinates of two points
export function getMid(point1: Point, point2: Point): Point {
    return {
        x: (point1.x + point2.x) / 2,
        y: (point1.y + point2.y) / 2
    }
}
