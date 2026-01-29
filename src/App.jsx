import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Projects from './pages/Projects'
import TestCasesNew from './pages/TestCasesNew'
import TestResults from './pages/TestResults'
import Settings from './pages/Settings'
import './App.css'


function App() {
    return (
        <Router>
            <div className="app">
                <Sidebar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Projects />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/project/:projectId" element={<TestCasesNew />} />
                        <Route path="/project/:projectId/test-results" element={<TestResults />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
