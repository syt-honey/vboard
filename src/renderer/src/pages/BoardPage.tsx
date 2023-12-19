import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'

import { BoardToolBox, ToolType } from '../components/BoardToolBox'
import { draw } from '../packages/board/svg'

export const BoardPage = observer((): React.ReactElement => {
    const [showTool, setShowTool] = useState(false)
    const [selected, setSelected] = useState<ToolType>(ToolType.Pencil)

    useEffect(() => {
        const el = document.getElementById('svg')

        if (el) {
            draw(el)
            setShowTool(true)
        }

        return (): void => setShowTool(false)
    }, [])

    return (
        <div className="board-page">
            {showTool && (
                <BoardToolBox
                    type={selected}
                    handleShapeSelect={(type): void => setSelected(type)}
                />
            )}

            <svg id="svg" fill="none" stroke="currentColor" strokeWidth="2"></svg>
        </div>
    )
})

export default BoardPage
