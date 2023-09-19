import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { routePages } from './route-page'

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {Object.keys(routePages).map((name) => {
                    const { component, path } = routePages[name]
                    return <Route key={name} path={path} Component={component} />
                })}
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
