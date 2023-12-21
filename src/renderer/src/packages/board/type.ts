export enum Weight {
    Bold = '6',
    Slim = '2',
    Regular = '4'
}

export type Point = { x: number; y: number }

export interface Drawable {
    path: SVGElement
    update: (coords: { x: number; y: number }) => void
    remove: () => void
}
