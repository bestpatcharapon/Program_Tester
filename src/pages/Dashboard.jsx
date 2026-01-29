import { useState } from 'react'
import {
    Play,
    Terminal,
    FileCode,
    Zap,
    CheckCircle2,
    XCircle,
    Clock,
    BarChart3
} from 'lucide-react'
import api from '../services/api'
import './Dashboard.css'

const Dashboard = ({ stats, environment }) => {
    const [runningFramework, setRunningFramework] = useState(null)
    const [consoleLogs, setConsoleLogs] = useState([])
    const [testResults, setTestResults] = useState(null)

    const frameworks = [
        {
            id: 'playwright',
            name: 'UI / Frontend',
            icon: '🎭',
            color: '#f59e0b',
            badge: 'Playwright',
            description: 'Run UI tests with Playwright.',
            command: '-e \'login\' (Grep)',
            buttonColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        },
        {
            id: 'pytest',
            name: 'Backend / API',
            icon: '🔷',
            color: '#3b82f6',
            badge: 'Pytest',
            description: 'Run API tests with Pytest.',
            command: '-k \'user\' (Keyword)',
            buttonColor: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        },
        {
            id: 'robot',
            name: 'Acceptance',
            icon: '🤖',
            color: '#a855f7',
            badge: 'Robot',
            description: 'Run acceptance tests with Robot.',
            command: '-i smoke (Include Tag)',
            buttonColor: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'
        }
    ]

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString()
        setConsoleLogs(prev => [...prev, { timestamp, message, type }])
    }

    const runTest = async (framework) => {
        setRunningFramework(framework.id)
        setConsoleLogs([])
        setTestResults(null)

        addLog(`🚀 Initializing ${framework.name} test suite...`, 'info')
        addLog(`📍 Environment: ${environment.toUpperCase()} `, 'info')
        addLog(`⚙️  Command: ${framework.command} `, 'info')
        addLog(``, 'info')

        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, 1000))
        addLog(`▶️  Starting test execution...`, 'running')

        await new Promise(resolve => setTimeout(resolve, 1500))
        addLog(`✓ Test environment initialized`, 'success')
        addLog(`✓ Loading test cases...`, 'success')

        await new Promise(resolve => setTimeout(resolve, 1000))
        const passed = Math.floor(Math.random() * 5) + 3
        const failed = Math.floor(Math.random() * 2)
        const total = passed + failed

        for (let i = 1; i <= total; i++) {
            await new Promise(resolve => setTimeout(resolve, 800))
            const isPassed = i <= passed
            if (isPassed) {
                addLog(`✅ Test Case ${i}: PASSED(${(Math.random() * 2 + 1).toFixed(2)}s)`, 'success')
            } else {
                addLog(`❌ Test Case ${i}: FAILED(${(Math.random() * 2 + 1).toFixed(2)}s)`, 'error')
                addLog(`   📸 Screenshot captured: evidence_${Date.now()}.png`, 'warning')
            }
        }

        await new Promise(resolve => setTimeout(resolve, 500))
        addLog(``, 'info')
        addLog(`🎉 Test execution completed!`, 'success')
        addLog(`📊 Results: ${passed} passed, ${failed} failed out of ${total} tests`, 'info')
        addLog(`⏱️  Total time: ${(Math.random() * 10 + 5).toFixed(2)} s`, 'info')

        setTestResults({ passed, failed, total })
        setRunningFramework(null)
    }

    const envColors = {
        dev: '#10b981',
        uat: '#f59e0b',
        prod: '#ef4444'
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="control-panel-header">
                <div className="header-title">
                    <Zap size={28} className="header-icon" />
                    <div>
                        <h1>Control Panel</h1>
                        <p className="header-subtitle">
                            Location: <span className="location-badge">Internal Labs</span>
                            <span className="env-indicator" style={{ background: envColors[environment] }}></span>
                            <span className="env-text">Target Env: {environment.toUpperCase()} (Local)</span>
                        </p>
                    </div>
                </div>
                <div className="header-status">
                    <span className="status-badge online">Online</span>
                </div>
            </div>

            {/* Framework Cards */}
            <div className="framework-cards">
                {frameworks.map((framework, index) => (
                    <div
                        key={framework.id}
                        className="framework-runner-card glass"
                        style={{ animationDelay: `${index * 100} ms` }}
                    >
                        <div className="card-header">
                            <div className="card-icon" style={{ background: framework.color }}>
                                <span className="icon-emoji">{framework.icon}</span>
                            </div>
                            <div className="card-title">
                                <h3>{framework.name}</h3>
                                <span className="framework-badge" style={{ borderColor: framework.color, color: framework.color }}>
                                    {framework.badge}
                                </span>
                            </div>
                        </div>

                        <p className="card-description">{framework.description}</p>

                        <div className="card-command">
                            <code>{framework.command}</code>
                        </div>

                        <button
                            className="run-button"
                            style={{ background: framework.buttonColor }}
                            onClick={() => runTest(framework)}
                            disabled={runningFramework !== null}
                        >
                            <Play size={18} />
                            {runningFramework === framework.id ? (
                                <>
                                    <span className="spinner"></span>
                                    Running...
                                </>
                            ) : (
                                `Run ${framework.badge} Test`
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Console Output */}
            <div className="console-panel glass">
                <div className="console-header">
                    <Terminal size={20} />
                    <h3>Console Output</h3>
                    {runningFramework && (
                        <span className="console-status">
                            <span className="status-dot"></span>
                            Waiting for command...
                        </span>
                    )}
                </div>

                <div className="console-body">
                    {consoleLogs.length === 0 ? (
                        <div className="console-empty">
                            <Terminal size={48} />
                            <p>Ready to execute tests</p>
                            <span>Select a framework above to begin</span>
                        </div>
                    ) : (
                        <div className="console-logs">
                            {consoleLogs.map((log, index) => (
                                <div key={index} className={`console - line ${log.type} `}>
                                    {log.timestamp && <span className="log-time">[{log.timestamp}]</span>}
                                    <span className="log-message">{log.message}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {testResults && (
                    <div className="console-summary">
                        <div className="summary-item success">
                            <CheckCircle2 size={16} />
                            <span>{testResults.passed} Passed</span>
                        </div>
                        <div className="summary-item error">
                            <XCircle size={16} />
                            <span>{testResults.failed} Failed</span>
                        </div>
                        <div className="summary-item total">
                            <BarChart3 size={16} />
                            <span>{testResults.total} Total</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stat-item">
                    <div className="stat-icon success">
                        <CheckCircle2 size={20} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats?.passed || 142}</span>
                        <span className="stat-label">Tests Passed</span>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon error">
                        <XCircle size={20} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats?.failed || 18}</span>
                        <span className="stat-label">Tests Failed</span>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon running">
                        <Clock size={20} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats?.total || 175}</span>
                        <span className="stat-label">Total Tests</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
