import './index.css'

import { Button } from 'antd'
import { useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import { SVGRect, SVGCircle, SVGArrow, SVGBoardPencil, SVGCursor, SVGClear } from '../global'
import { ShapeType, ToolType, BoardStoreOptionsType } from '@renderer/pages/board'

export interface BoardToolBoxProps {
    store: BoardStoreOptionsType
    updateBoardStore: (arg: BoardStoreOptionsType) => void
}

export const BoardToolBox = observer(
    ({ store, updateBoardStore }: BoardToolBoxProps): React.ReactElement => {
        const getStyle = useCallback(
            (t: ToolType) => {
                return {
                    fill: t === store.type ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, .5)'
                }
            },
            [store.type]
        )

        const setToolType = useCallback(
            (t: ToolType) => {
                updateBoardStore({
                    ...store,
                    type: t,
                    shape: getShape(t),
                    ignoreMouseEvents: t === ToolType.Cursor
                })
            },
            [store]
        )

        const getShape = (type: ToolType): ShapeType => {
            switch (type) {
                case ToolType.Rect:
                    return ShapeType.Rect
                case ToolType.Circle:
                    return ShapeType.Circle
                case ToolType.Arrow:
                    return ShapeType.Arrow
                default:
                    return ShapeType.Line
            }
        }

        const setClear = useCallback(
            (clearable: boolean) => {
                updateBoardStore({ ...store, clearable })
            },
            [store]
        )

        return (
            <div className="board-toolbox">
                <Button
                    type="link"
                    icon={<SVGRect style={getStyle(ToolType.Rect)} />}
                    onClick={(): void => setToolType(ToolType.Rect)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGCircle style={getStyle(ToolType.Circle)} />}
                    onClick={(): void => setToolType(ToolType.Circle)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGArrow style={getStyle(ToolType.Arrow)} />}
                    onClick={(): void => setToolType(ToolType.Arrow)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGCursor style={getStyle(ToolType.Cursor)} />}
                    onClick={(): void => setToolType(ToolType.Cursor)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGBoardPencil style={getStyle(ToolType.Pencil)} />}
                    onClick={(): void => setToolType(ToolType.Pencil)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGClear style={{ fill: 'rgba(255, 255, 255, .5)' }} />}
                    onClick={(): void => setClear(true)}
                ></Button>
            </div>
        )
    }
)

export default BoardToolBox
