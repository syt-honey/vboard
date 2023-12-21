/**
 * inspired by hyrious, see: https://github.com/hyrious/ink
 */
import { input } from './input'
import { Line } from './line'
import { Rect } from './rect'
import { svg } from './common'
import { Drawable, Weight } from './type'

export class DrawPath<T extends Drawable> {
    private el: HTMLElement | null = null
    private targetEvent: { unsubscribe: () => void } | null = null

    color: string = 'red'
    fill: string = 'none'
    weight: Weight = Weight.Regular

    private path: T | null = null
    private createPath: () => T

    constructor({
        el,
        createPath,
        startCallback
    }: {
        el: HTMLElement
        createPath: () => T
        startCallback: () => void
    }) {
        this.el = el
        this.targetEvent = input(this.el, {
            start: startCallback.bind(this),
            update: this.update.bind(this),
            finish: this.finish.bind(this)
        })

        this.createPath = createPath
    }

    start(): void {
        this.path = this.createPath()

        if (this.el && this.path) {
            this.el.append(this.path.path)
        }
    }

    update(ev: PointerEvent): void {
        const { offsetX: x, offsetY: y } = ev

        if (this.path) {
            this.path.update({ x, y })
        }
    }

    finish(): void {
        this.path = null
    }

    setColor(color: string): void {
        this.color = color
    }

    destroy(): void {
        if (this.targetEvent) {
            this.targetEvent.unsubscribe()
        }

        this.el = null
    }
}

export class DrawLine extends DrawPath<Line> {
    constructor(el: HTMLElement) {
        super({
            el,
            createPath: () => new Line(svg('path')),
            startCallback: () => this.start()
        })
    }
}

export class DrawRect extends DrawPath<Rect> {
    constructor(el: HTMLElement) {
        super({
            el,
            createPath: () => new Rect(svg('path')),
            startCallback: () => this.start()
        })
    }
}
