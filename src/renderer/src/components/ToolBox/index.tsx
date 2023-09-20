import { useMemo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { RecorderContext } from '../StoreProvider'

export const ToolBox = observer(() => {
    const recorderStore = useContext(RecorderContext)

    const text = useMemo(() => (recorderStore.isIdle ? 'Start' : 'Stop'), [recorderStore.isIdle])
    return <div className="tool-box">{text}</div>
})

export default ToolBox
