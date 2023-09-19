import React from 'react'
import ReactDOM from 'react-dom/client'
import { StoreProvider } from './components/StoreProvider'
import './assets/index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <StoreProvider>
            <App />
        </StoreProvider>
    </React.StrictMode>
)
