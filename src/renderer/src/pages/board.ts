export enum ToolType {
    Rect = 'rect',
    Circle = 'circle',
    Arrow = 'arrow',
    Pencil = 'pencil',

    Text = 'text',
    Cursor = 'cursor',
    Clear = 'clear'
}

export enum ShapeType {
    Rect = 'rect',
    Circle = 'circle',
    Arrow = 'arrow',
    Line = 'line'
}

export interface BoardStoreOptionsType {
    type: ToolType
    clearable: boolean
    ignoreMouseEvents: boolean
    shape: ShapeType
}

export const BoardStoreName = 'BoardStore'
export const LS_BOARD_VERSION = 1

export const defaultBoard = {
    type: ToolType.Pencil,
    shape: ShapeType.Line,
    clearable: false,
    ignoreMouseEvents: false
} as BoardStoreOptionsType
