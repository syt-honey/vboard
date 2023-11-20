import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { routePages } from './route-page'

export const AppRouter: React.FC = () => {
    return (
        <HashRouter>
            <Routes>
                {Object.keys(routePages).map((name) => {
                    const { component, path } = routePages[name]
                    return <Route key={name} path={path} Component={component} />
                })}
            </Routes>
        </HashRouter>
    )
}

export default AppRouter
