import { platform } from 'os'
import path from 'path'

const isMac = platform() === 'darwin'
const isWin = platform() === 'win32'

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

const baseUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.resolve(__dirname, '..', 'renderer', 'index.html')}`

const preloadUrl = path.join(__dirname, '..', 'preload', 'index.js')

const runtime = { isMac, isWin, isDev, isProd, baseUrl, preloadUrl }

export default runtime
