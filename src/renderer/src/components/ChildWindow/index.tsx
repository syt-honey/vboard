import { createPortal } from 'react-dom'
import React, { useEffect, useState } from 'react'
import { StyleSheetManager } from 'styled-components'
import baseCssModule from '../../assets/index.less?inline'

import { WindowType } from '../../types/window'
import { useChangesEffect } from '../../hooks/lifecycle'
import { ipcWindowOptionsChanges } from '../../utils/ipc'

type ChildWindowOptionsProps = Partial<Electron.BrowserWindowConstructorOptions>

export interface ChildWindowProps extends React.PropsWithChildren<ChildWindowOptionsProps> {
    type: WindowType
    onClosed?: () => void
    onFinished?: () => void
}

export const ChildWindow = function ChildWindow({
    children,
    onClosed,
    onFinished,
    type: windowType,
    ...options
}: ChildWindowProps): React.ReactElement {
    const [newWindow, setNewWindow] = useState<Window | null>(null)

    useEffect(() => {
        if (newWindow) {
            onFinished?.()
        } else {
            const w = window.open(
                'about:blank',
                '_blank',
                `config=${JSON.stringify({ options, windowType })}`
            )

            if (w) {
                setNewWindow(w)

                // add base css to child window head tag
                if (baseCssModule) {
                    const style = document.createElement('style')
                    style.textContent = baseCssModule
                    w.document.head.appendChild(style)
                }
            }
        }

        return (): void => {
            newWindow?.close()
        }
    }, [newWindow])

    useChangesEffect(() => {
        // update window options when options changed
        // only support `position` and `size` now
        if (options.title) {
            ipcWindowOptionsChanges(options.title, options)
        }
    }, [options])

    useEffect(() => {
        // the child window should instantly stop rendering itself when it's closed externally
        // window.electronBridge.onWindowClosed(id, onClosed)
    }, [onClosed])

    return (
        <>
            {newWindow &&
                createPortal(
                    <StyleSheetManager target={newWindow.document.body}>
                        {children}
                    </StyleSheetManager>,
                    newWindow.document.body
                )}
        </>
    )
}