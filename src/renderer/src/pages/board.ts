export enum ShapeType {
    Rect = 'rect',
    Circle = 'circle',
    Arrow = 'arrow',
    Line = 'line'
}

export interface BoardStoreOptionsType {
    clearable: boolean
    ignoreMouseEvents: boolean
    shape: ShapeType
}

export const BoardStoreName = 'BoardStore'

export const defaultBoard = {
    shape: ShapeType.Line,
    clearable: false,
    ignoreMouseEvents: false
} as BoardStoreOptionsType
