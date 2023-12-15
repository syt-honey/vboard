import { platform } from 'os'
import path from 'path'

const isMac = platform() === 'darwin'
const isWin = platform() === 'win32'

const isDev = process.env.NODE_ENV === 'development'

const baseUrl = (): string =>
    isDev ? 'http://localhost:5173/#' : `file://${path.join(__dirname, '../renderer/index.html#')}`

const preloadUrl = path.join(__dirname, '..', 'preload', 'index.js')

export const runtime = { isMac, isWin, isDev, baseUrl, preloadUrl }

export default runtime
