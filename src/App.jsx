import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import TestRunner from './pages/TestRunner'
import TestCases from './pages/TestCases'
import TestCasesNew from './pages/TestCasesNew'
import TestResults from './pages/TestResults'
import EvidenceGallery from './pages/EvidenceGallery'
import Settings from './pages/Settings'
import './App.css'

function App() {
    const [environment, setEnvironment] = useState('dev')
    const [testStats, setTestStats] = useState({
        total: 0,
        passed: 0,
        failed: 0,
        running: 0
    })

    useEffect(() => {
        // Load saved environment
        const savedEnv = localStorage.getItem('autotest-environment')
        if (savedEnv) {
            setEnvironment(savedEnv)
        }
    }, [])

    const handleEnvironmentChange = (env) => {
        setEnvironment(env)
        localStorage.setItem('autotest-environment', env)
    }

    return (
        <Router>
            <div className="app">
                <Sidebar
                    environment={environment}
                    onEnvironmentChange={handleEnvironmentChange}
                />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard stats={testStats} environment={environment} />} />
                        <Route path="/runner" element={<TestRunner onStatsUpdate={setTestStats} environment={environment} />} />
                        <Route path="/testcases" element={<TestCases />} />
                        <Route path="/testcases-new" element={<TestCasesNew />} />
                        <Route path="/test-results" element={<TestResults />} />
                        <Route path="/gallery" element={<EvidenceGallery />} />
                        <Route path="/settings" element={<Settings environment={environment} onEnvironmentChange={handleEnvironmentChange} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
