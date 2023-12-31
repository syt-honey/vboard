import React from 'react'
import ReactDOM from 'react-dom/client'
import { StoreProvider } from './components/StoreProvider'
import './assets/index.less'
import './assets/pages.less'
import './assets/reset.less'
import './i18n'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <StoreProvider>
            <App />
        </StoreProvider>
    </React.StrictMode>
)
