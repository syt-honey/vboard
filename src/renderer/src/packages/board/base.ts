import { Point, Drawable } from './type'

export abstract class BaseShape implements Drawable {
    path: SVGElement

    constructor(path: SVGElement) {
        this.path = path
    }

    remove(): void {
        this.path.remove()
    }

    abstract update(point: Point): void
}
