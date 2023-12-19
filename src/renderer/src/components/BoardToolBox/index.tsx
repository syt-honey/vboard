import './index.css'

import { Button } from 'antd'
import { useRef } from 'react'
import Draggable from 'react-draggable'
import { observer } from 'mobx-react-lite'

import { SVGRect, SVGCircle, SVGArrow, SVGBoardPencil, SVGText, SVGCursor } from '../global'

export enum ToolType {
    Rect = 'rect',
    Circle = 'circle',
    Arrow = 'arrow',
    Pencil = 'pencil',
    Text = 'text',
    Cursor = 'cursor'
}

export interface BoardToolBoxProps {
    type: ToolType
    handleShapeSelect: (shape: ToolType) => void
}

export const BoardToolBox = observer(({ type, handleShapeSelect }: BoardToolBoxProps) => {
    const nodeRef = useRef(null)

    function getStyle(t): { fill: string } {
        // @TODO: usually we should use store to manage the state
        return { fill: t === type ? 'red' : 'white' }
    }

    return (
        <Draggable defaultPosition={{ x: 0, y: 10 }} nodeRef={nodeRef}>
            <div ref={nodeRef} className="board-toolbox">
                <Button
                    type="link"
                    icon={<SVGRect style={getStyle(ToolType.Rect)} />}
                    onClick={(): void => handleShapeSelect(ToolType.Rect)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGCircle style={getStyle(ToolType.Circle)} />}
                    onClick={(): void => handleShapeSelect(ToolType.Circle)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGArrow style={getStyle(ToolType.Arrow)} />}
                    onClick={(): void => handleShapeSelect(ToolType.Arrow)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGCursor style={getStyle(ToolType.Cursor)} />}
                    onClick={(): void => handleShapeSelect(ToolType.Cursor)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGBoardPencil style={getStyle(ToolType.Pencil)} />}
                    onClick={(): void => handleShapeSelect(ToolType.Pencil)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGText style={getStyle(ToolType.Text)} />}
                    onClick={(): void => handleShapeSelect(ToolType.Text)}
                ></Button>
            </div>
        </Draggable>
    )
})

export default BoardToolBox
