import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import { LibraryBrowser } from './LibraryBrowser'
import { Dashboard } from './Dashboard'
import './index.css'

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Navigate to="/category/books" replace />} />
                    <Route path="category/:categoryId" element={<LibraryBrowser />} />
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)
