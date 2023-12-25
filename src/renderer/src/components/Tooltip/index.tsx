import React from 'react'
import { observer } from 'mobx-react-lite'
import { styled } from 'styled-components'

import { ChildWindow } from '../ChildWindow'
import { WindowType } from '@renderer/types/window'

// Noted: only support one line, and the `max width` of tooltip is set by the props `position: { width }`
// So do not set too long text while using this tooltip now.

const TooltipContainer = styled.div`
    position: relative;
    display: block;
    width: max-content;
    max-width: 250px;
    height: 100%;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.88);
    font-size: 14px;
    line-height: 1.5;
    list-style: none;
    z-index: 1070;
    visibility: visible;
    word-break: keep-all;
    overflow: hidden;
    white-space: nowrap;
`

const TooltipContent = styled.div`
    position: relative;
    min-width: 32px;
    min-height: 32px;
    padding: 6px 8px;
    color: #fff;
    text-align: start;
    text-decoration: none;
    word-wrap: break-word;
    background-color: rgba(0, 0, 0, 0.85);
    border-radius: 6px;
    box-shadow:
        0 6px 16px 0 rgba(0, 0, 0, 0.08),
        0 3px 6px -4px rgba(0, 0, 0, 0.12),
        0 9px 28px 8px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
`

export const COUNTDOWN_WINDOW_ID = 'tooltip'

export interface TooltipProps {
    position?: { x?: number; y?: number; width?: number; height?: number }
    // To specify every tooltip. It is required when there are two or more tooltips shown at the same time.
    prefix?: string
    title: string
    onToolTipMounted?: () => void
}

export const Tooltip = observer(
    ({ position, prefix = '', title, onToolTipMounted }: TooltipProps): React.ReactElement => {
        return (
            <ChildWindow
                type={WindowType.TOOLTIP}
                x={position?.x || 0}
                y={position?.y || 0}
                width={position?.width || 200}
                height={position?.height || 200}
                alwaysOnTop
                resizable={false}
                frame={false}
                transparent
                title={prefix + COUNTDOWN_WINDOW_ID}
                onFinished={onToolTipMounted}
            >
                <TooltipContainer>
                    <TooltipContent>{title}</TooltipContent>
                </TooltipContainer>
            </ChildWindow>
        )
    }
)

export default Tooltip
