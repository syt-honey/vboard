import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'

import { draw } from '../packages/board/svg'

export const BoardPage = observer((): React.ReactElement => {
    useEffect(() => {
        const el = document.getElementById('svg')

        if (el) {
            draw(el)
        }
    })

    return (
        <div className="board-page">
            <svg id="svg" fill="none" stroke="currentColor" strokeWidth="2"></svg>
        </div>
    )
})

export default BoardPage
