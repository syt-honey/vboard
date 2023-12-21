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
