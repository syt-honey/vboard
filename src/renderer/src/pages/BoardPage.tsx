import React, { useRef, useEffect, useState, useCallback } from 'react'

import useLocalStorageEvent from '@renderer/hooks/share'
import { ipcCreateBoardToolWindow } from '@renderer/utils'
import { setBoardWindowIgnoreMouseEvents } from '@renderer/utils/ipc'
import { DrawArrow, DrawEllipse, DrawLine, DrawRect } from '@renderer/packages/board/svg'
import {
    ShapeType,
    BoardStoreName,
    BoardStoreOptionsType,
    defaultBoard,
    LS_BOARD_VERSION
} from './board'

export type BoardType = DrawRect | DrawLine | DrawEllipse | DrawArrow

export const BoardPage = (): React.ReactElement => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [board, setBoard] = useState<BoardType | null>(null)
    const [store, setBoardStore] = useLocalStorageEvent<BoardStoreOptionsType>({
        key: BoardStoreName,
        defaultValues: defaultBoard,
        LS_VERSION: LS_BOARD_VERSION
    })

    useEffect(() => {
        // if clearable is true, clear all svg child elements
        if (svgRef.current && store.clearable) {
            while (svgRef.current.firstChild) {
                svgRef.current.removeChild(svgRef.current.firstChild)
            }
            updateBoardStore({ ...store, clearable: false })
        }
    }, [svgRef.current, store.clearable])

    useEffect(() => {
        let currentBoard: BoardType | null = null
        if (svgRef.current) {
            onBoardMounted?.()
            currentBoard = getBoard(svgRef.current)
        }

        if (currentBoard) {
            setBoard(currentBoard)
        }

        return (): void => {
            currentBoard?.destroy()
        }
    }, [store.shape])

    useEffect(() => {
        setBoardWindowIgnoreMouseEvents({ ignore: store.ignoreMouseEvents })
    }, [store.ignoreMouseEvents])

    const updateBoardStore = useCallback(
        (newOptions: BoardStoreOptionsType) => {
            setBoardStore(newOptions)
        },
        [setBoardStore]
    )

    const getBoard = useCallback(
        (el: SVGSVGElement) => {
            let board: BoardType | null = null
            if (store.shape === ShapeType.Line) {
                board = new DrawLine(el)
            }

            if (store.shape === ShapeType.Rect) {
                board = new DrawRect(el)
            }

            if (store.shape === ShapeType.Circle) {
                board = new DrawEllipse(el)
            }

            if (store.shape === ShapeType.Arrow) {
                board = new DrawArrow(el)
            }

            return board
        },
        [store.shape]
    )

    const onBoardMounted = (): void => {
        ipcCreateBoardToolWindow({ url: '/board-toolbox' })
    }
    return (
        <div className="board-page">
            <svg
                ref={svgRef}
                fill={board?.fill}
                stroke={board?.color}
                strokeWidth={board?.weight}
            ></svg>
        </div>
    )
}

export default BoardPage
