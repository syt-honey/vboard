import './index.css'

import { Button } from 'antd'
import { useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import { SVGRect, SVGCircle, SVGArrow, SVGBoardPencil, SVGCursor, SVGClear } from '../global'
import { ShapeType, BoardStoreOptionsType } from '@renderer/pages/board'

export interface BoardToolBoxProps {
    store: BoardStoreOptionsType
    updateBoardStore: (arg: BoardStoreOptionsType) => void
}

export const BoardToolBox = observer(
    ({ store, updateBoardStore }: BoardToolBoxProps): React.ReactElement => {
        const getShapeStyle = useCallback(
            (s: ShapeType) => getColor(s === store.shape && !store.ignoreMouseEvents),
            [store.shape, store.ignoreMouseEvents]
        )

        const getCursorStyle = useCallback(
            () => getColor(store.ignoreMouseEvents),
            [store.ignoreMouseEvents]
        )

        const getColor = (selected: boolean): { fill: string } => {
            return {
                fill: selected ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, .5)'
            }
        }

        const setShape = useCallback(
            (shape: ShapeType) => {
                updateBoardStore({
                    ...store,
                    shape,
                    ignoreMouseEvents: false
                })
            },
            [store]
        )

        const setMouseEventsIgnore = useCallback(() => {
            const ignore = store.ignoreMouseEvents
            updateBoardStore({
                ...store,
                ignoreMouseEvents: !ignore
            })
        }, [store])

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
                    icon={<SVGRect style={getShapeStyle(ShapeType.Rect)} />}
                    onClick={(): void => setShape(ShapeType.Rect)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGCircle style={getShapeStyle(ShapeType.Circle)} />}
                    onClick={(): void => setShape(ShapeType.Circle)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGArrow style={getShapeStyle(ShapeType.Arrow)} />}
                    onClick={(): void => setShape(ShapeType.Arrow)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGCursor style={getCursorStyle()} />}
                    onClick={setMouseEventsIgnore}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGBoardPencil style={getShapeStyle(ShapeType.Line)} />}
                    onClick={(): void => setShape(ShapeType.Line)}
                ></Button>

                <Button
                    type="link"
                    icon={<SVGClear style={getColor(false)} />}
                    onClick={(): void => setClear(true)}
                ></Button>
            </div>
        )
    }
)

export default BoardToolBox
