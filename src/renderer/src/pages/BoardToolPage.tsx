import { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import useLocalStorageState from 'electron-localstorage-store'

import { BoardToolBox } from '@renderer/components/BoardToolBox'
import { BoardStoreName, BoardStoreOptionsType, defaultBoard } from './board'

export const BoardToolPage = observer((): React.ReactElement => {
    const [store, setBoardStore] = useLocalStorageState<BoardStoreOptionsType>({
        key: BoardStoreName,
        defaultValue: defaultBoard
    })
    const updateBoardStore = useCallback(
        (newOptions: BoardStoreOptionsType) => {
            setBoardStore(newOptions)
        },
        [setBoardStore]
    )

    return (
        <div className="board-toolbox-page">
            <BoardToolBox store={store} updateBoardStore={updateBoardStore} />
        </div>
    )
})

export default BoardToolPage
