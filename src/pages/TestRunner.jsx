import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Play,
    Square,
    RotateCw,
    CheckCircle2,
    XCircle,
    Clock,
    Terminal,
    Zap,
    FileCode,
    Camera
} from 'lucide-react'
import './TestRunner.css'

const TestRunner = ({ onStatsUpdate, environment }) => {
    const [selectedFramework, setSelectedFramework] = useState('robot')
    const [isRunning, setIsRunning] = useState(false)
    const [testResults, setTestResults] = useState([])
    const [logs, setLogs] = useState([])

    const frameworks = [
        {
            id: 'robot',
            name: 'Robot Framework',
            icon: '🤖',
            color: '#3b82f6',
            description: 'Acceptance testing framework'
        },
        {
            id: 'playwright',
            name: 'Playwright',
            icon: '🎭',
            color: '#10b981',
            description: 'Modern web testing'
        },
        {
            id: 'pytest',
            name: 'Pytest',
            icon: '🐍',
            color: '#a855f7',
            description: 'Python testing framework'
        },
    ]

    const mockTests = [
        { id: 1, name: 'Login Test', status: 'idle', duration: 0, screenshot: null },
        { id: 2, name: 'Dashboard Load Test', status: 'idle', duration: 0, screenshot: null },
        { id: 3, name: 'Form Submission Test', status: 'idle', duration: 0, screenshot: null },
        { id: 4, name: 'API Integration Test', status: 'idle', duration: 0, screenshot: null },
        { id: 5, name: 'Logout Test', status: 'idle', duration: 0, screenshot: null },
    ]

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString()
        setLogs(prev => [...prev, { timestamp, message, type }])
    }

    const runTests = async () => {
        setIsRunning(true)
        setTestResults([])
        setLogs([])

        addLog(`🚀 Starting ${frameworks.find(f => f.id === selectedFramework).name} tests on ${environment.toUpperCase()}...`, 'info')
        addLog(`📁 Loading test suite...`, 'info')

        let passed = 0
        let failed = 0

        for (let i = 0; i < mockTests.length; i++) {
            const test = mockTests[i]

            // Simulate test running
            setTestResults(prev => [...prev, { ...test, status: 'running' }])
            addLog(`▶️  Running: ${test.name}`, 'running')

            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

            // Random pass/fail
            const isPassed = Math.random() > 0.2
            const duration = (1.5 + Math.random() * 2).toFixed(2)

            setTestResults(prev => {
                const updated = [...prev]
                updated[i] = {
                    ...test,
                    status: isPassed ? 'passed' : 'failed',
                    duration: parseFloat(duration),
                    screenshot: !isPassed ? `/evidence/${Date.now()}-${test.id}.png` : null
                }
                return updated
            })

            if (isPassed) {
                passed++
                addLog(`✅ PASSED: ${test.name} (${duration}s)`, 'success')
            } else {
                failed++
                addLog(`❌ FAILED: ${test.name} (${duration}s)`, 'error')
                addLog(`📸 Screenshot captured: evidence_${Date.now()}.png`, 'warning')
            }

            // Update stats
            onStatsUpdate({
                total: mockTests.length,
                passed,
                failed,
                running: mockTests.length - (passed + failed)
            })
        }

        setIsRunning(false)
        addLog(`\n🎉 Test execution completed!`, 'success')
        addLog(`📊 Results: ${passed} passed, ${failed} failed out of ${mockTests.length} tests`, 'info')
    }

    const stopTests = () => {
        setIsRunning(false)
        addLog('⏹️  Test execution stopped by user', 'warning')
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed':
                return <CheckCircle2 size={18} className="status-icon success" />
            case 'failed':
                return <XCircle size={18} className="status-icon error" />
            case 'running':
                return <Clock size={18} className="status-icon running animate-spin" />
            default:
                return <Clock size={18} className="status-icon idle" />
        }
    }

    return (
        <div className="test-runner">
            {/* Header */}
            <div className="runner-header">
                <div>
                    <h1>Test Runner</h1>
                    <p>Execute automated tests and capture evidence</p>
                </div>
                <div className="runner-actions">
                    {!isRunning ? (
                        <button className="btn btn-success" onClick={runTests}>
                            <Play size={18} />
                            Run Tests
                        </button>
                    ) : (
                        <button className="btn btn-outline" onClick={stopTests}>
                            <Square size={18} />
                            Stop
                        </button>
                    )}
                </div>
            </div>

            {/* Framework Selector */}
            <div className="framework-selector">
                <h3>
                    <FileCode size={20} />
                    Select Testing Framework
                </h3>
                <div className="framework-grid">
                    {frameworks.map(framework => (
                        <motion.div
                            key={framework.id}
                            className={`framework-card glass ${selectedFramework === framework.id ? 'active' : ''}`}
                            onClick={() => !isRunning && setSelectedFramework(framework.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ '--framework-color': framework.color }}
                        >
                            <div className="framework-icon">{framework.icon}</div>
                            <div className="framework-info">
                                <h4>{framework.name}</h4>
                                <p>{framework.description}</p>
                            </div>
                            {selectedFramework === framework.id && (
                                <motion.div
                                    className="framework-check"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <CheckCircle2 size={20} />
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Test Results */}
            <div className="test-results-section">
                <div className="results-header">
                    <h3>
                        <Zap size={20} />
                        Test Execution
                    </h3>
                    {testResults.length > 0 && (
                        <div className="results-summary">
                            <span className="summary-item success">
                                {testResults.filter(t => t.status === 'passed').length} Passed
                            </span>
                            <span className="summary-item error">
                                {testResults.filter(t => t.status === 'failed').length} Failed
                            </span>
                            <span className="summary-item running">
                                {testResults.filter(t => t.status === 'running').length} Running
                            </span>
                        </div>
                    )}
                </div>

                <div className="test-list">
                    <AnimatePresence>
                        {testResults.map((test, index) => (
                            <motion.div
                                key={test.id}
                                className={`test-item glass ${test.status}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="test-status">
                                    {getStatusIcon(test.status)}
                                </div>
                                <div className="test-info">
                                    <h4>{test.name}</h4>
                                    {test.duration > 0 && (
                                        <span className="test-duration">{test.duration}s</span>
                                    )}
                                </div>
                                {test.screenshot && (
                                    <div className="test-screenshot">
                                        <Camera size={16} />
                                        <span>Evidence captured</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Console Logs */}
            <div className="console-section glass">
                <div className="console-header">
                    <Terminal size={20} />
                    <h3>Console Output</h3>
                    <button
                        className="btn-icon"
                        onClick={() => setLogs([])}
                        disabled={logs.length === 0}
                    >
                        <RotateCw size={16} />
                    </button>
                </div>
                <div className="console-output">
                    {logs.length === 0 ? (
                        <div className="console-empty">
                            <Terminal size={32} />
                            <p>No logs yet. Run tests to see output.</p>
                        </div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className={`console-line ${log.type}`}>
                                <span className="console-timestamp">[{log.timestamp}]</span>
                                <span className="console-message">{log.message}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default TestRunner
