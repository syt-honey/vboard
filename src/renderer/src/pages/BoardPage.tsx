import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'

import { Board } from '../components/Board'
import { BoardToolBox, ToolType } from '../components/BoardToolBox'

export enum ShapeType {
    Rect = 'rect',
    Circle = 'circle',
    Arrow = 'arrow',
    Line = 'line'
}

export const BoardPage = observer((): React.ReactElement => {
    const [showTool, setShowTool] = useState(false)
    const [selected, setSelected] = useState<ToolType>(ToolType.Pencil)

    const [shape, setShape] = useState<ShapeType | null>(ShapeType.Line)
    const [clear, setClear] = useState(false)

    const onBoardMounted = useCallback(() => {
        setShowTool(true)
    }, [showTool])

    const handleShapeSelect = useCallback(
        (type: ToolType): void => {
            if (type === ToolType.Clear) {
                setClear(true)
                return
            }
            setSelected(type)

            if (type === ToolType.Pencil) {
                setShape(ShapeType.Line)
            }

            if (type === ToolType.Rect) {
                setShape(ShapeType.Rect)
            }

            if (type === ToolType.Circle) {
                setShape(ShapeType.Circle)
            }

            if (type === ToolType.Arrow) {
                setShape(ShapeType.Arrow)
            }

            setClear(false)
        },
        [selected, shape]
    )

    return (
        <div className="board-page">
            {showTool && <BoardToolBox type={selected} handleShapeSelect={handleShapeSelect} />}

            <Board shape={shape} clear={clear} onBoardMounted={onBoardMounted} />
        </div>
    )
})

export default BoardPage
