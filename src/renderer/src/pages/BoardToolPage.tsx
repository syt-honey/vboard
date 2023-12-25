import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'

import useLocalStorageEvent from '@renderer/hooks/share'
import { BoardToolBox } from '@renderer/components/BoardToolBox'
import { BoardStoreName, BoardStoreOptionsType, defaultBoard, LS_BOARD_VERSION } from './board'

export const BoardToolPage = observer((): React.ReactElement => {
    const [store, setBoardStore] = useLocalStorageEvent<BoardStoreOptionsType>({
        key: BoardStoreName,
        defaultValues: defaultBoard,
        LS_VERSION: LS_BOARD_VERSION
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
