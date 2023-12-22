import { Point } from './type'
import { BaseShape } from './base'
import { M, L, distance, getMid } from './common'

/**
 * draw an arrow like the arrow tool in the WeChat screenshot
 */
export class Arrow extends BaseShape {
    /**
     * The drawing idea is as follows:
     *
     * (
     *      For the sake of expression, let's assume:
     *          `start` -> A, `end` -> B, `wing1` -> C, `wing2` -> D, `wrinkle1` -> E, `wrinkle2` -> F,
     *          the centroid of ΔBCD -> G
     * )
     *
     * 1.
     *      * First, we should determine the vertices according to the arrow shape. It's easy to see that there are six vertices: A、B、C、D、E、F
     *      * And then draw lines between all points and points, so as to achieve the drawing of the arrow
     * 2.
     *      * And then we need to define the position of C, D, E, F.
     *      * Let's say: (1) the length of AB is `L`; (2) the length of BC,BD is `L/3` (3) and ∠ABC and ∠ABD are both 30 degrees.
     *        So, according to the above conditions, we can uniquely identify points C and D.
     *      * Now, let's also assume that E and F are respectively the midpoints of CG and DG.
     *        So, according to the above conditions, we can uniquely identify points E and F.
     * 3.
     *      * Now, we've defined all points, the next thing is according the coordicate of A and B to calculate the remaining points C,D,E,F,G
     */

    private start: Point | null = null

    private wing1: Point | null = null
    private wing2: Point | null = null
    private wrinkle1: Point | null = null
    private wrinkle2: Point | null = null

    defn: string = ''

    constructor(path: SVGElement) {
        super(path)
    }

    update(point: Point): void {
        // start -> A; point -> B
        if (this.start) {
            // calculate all points
            ;[this.wing1, this.wing2] = this.getCAndD(
                this.start,
                point,
                distance(this.start, point) / 3
            ) // C, D
            const g = this.centroid(point, this.wing1, this.wing2) // G
            this.wrinkle1 = getMid(this.wing1, g) // E
            this.wrinkle2 = getMid(this.wing2, g) // F

            // draw all lines
            this.defn = `${
                M(this.start) +
                L(this.wrinkle2) +
                L(this.wing2) +
                L(point) +
                L(this.wing1) +
                L(this.wrinkle1)
            }Z`

            this.path.setAttribute('d', this.defn)
            this.path.style.fill = 'currentColor'
        } else {
            this.start = point
        }
    }

    private centroid(point1: Point, point2: Point, point3: Point): Point {
        const centroidX = (point1.x + point2.x + point3.x) / 3
        const centroidY = (point1.y + point2.y + point3.y) / 3

        return { x: centroidX, y: centroidY }
    }

    private getCAndD(start: Point, point: Point, d): Point[] {
        const { x: x1, y: y1 } = start
        const { x: x2, y: y2 } = point
        const cos30 = Math.sqrt(3) / 2
        const sin30 = 1 / 2

        // The directional vector of the segment AB
        const dx = x2 - x1
        const dy = y2 - y1

        // Calculate the directional vectors for rotations of 30 degrees and -30 degrees.
        const rotated30 = {
            x: cos30 * dx - sin30 * dy,
            y: sin30 * dx + cos30 * dy
        }
        const rotatedNeg30 = {
            x: cos30 * dx + sin30 * dy,
            y: -sin30 * dx + cos30 * dy
        }

        // Scale the vector to make its length equal to d/3.
        const scale = d / 3 / Math.sqrt(dx * dx + dy * dy)
        const scaled30 = { x: rotated30.x * scale, y: rotated30.y * scale }
        const scaledNeg30 = { x: rotatedNeg30.x * scale, y: rotatedNeg30.y * scale }

        const C = { x: x2 - scaled30.x, y: y2 - scaled30.y }
        const D = { x: x2 - scaledNeg30.x, y: y2 - scaledNeg30.y }

        return [C, D]
    }
}
