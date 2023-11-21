import { platform } from 'os'
import { app } from 'electron'
import path from 'path'

const isMac = platform() === 'darwin'
const isWin = platform() === 'win32'

// TODO: add a env variable to control this
const isDev = process.env.NODE_ENV === 'development'

const baseUrl = isDev
    ? 'http://localhost:5173/#'
    : `file://${app.getAppPath()}/renderer/index.html#`

const preloadUrl = path.join(__dirname, '..', 'preload', 'index.js')

const runtime = { isMac, isWin, isDev, baseUrl, preloadUrl }

export default runtime
