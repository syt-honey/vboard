import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'

import { DrawRect, DrawLine, DrawEllipse, DrawArrow } from '../../packages/board/svg'

import { ShapeType } from '../../pages/BoardPage'

export interface BoardProps {
    shape: ShapeType
    onBoardMounted?: () => void
}

export const Board = observer(({ shape, onBoardMounted }: BoardProps) => {
    const svgRef = useRef(null)
    const [draw, setDraw] = useState<DrawRect | DrawLine | DrawEllipse | DrawArrow | null>(null)

    useEffect(() => {
        // use this to destroy the current draw instance
        let currentDraw
        if (svgRef.current) {
            onBoardMounted?.()

            if (shape === ShapeType.Line) {
                currentDraw = new DrawLine(svgRef.current)
            }

            if (shape === ShapeType.Rect) {
                currentDraw = new DrawRect(svgRef.current)
            }

            if (shape === ShapeType.Circle) {
                currentDraw = new DrawEllipse(svgRef.current)
            }

            if (shape === ShapeType.Arrow) {
                currentDraw = new DrawArrow(svgRef.current)
            }

            setDraw(currentDraw)
        }

        return (): void => {
            currentDraw?.destroy()
        }
    }, [onBoardMounted, shape])

    return (
        <svg ref={svgRef} fill={draw?.fill} stroke={draw?.color} strokeWidth={draw?.weight}></svg>
    )
})

export default Board
