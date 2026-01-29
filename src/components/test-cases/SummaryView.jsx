import React from 'react'
import '../../pages/TestCasesNew.css'

const SummaryView = ({ modules, testResults }) => {

    // Derived Stats
    const totalTestCases = modules.reduce((acc, m) =>
        acc + m.scenarios.reduce((acc2, s) => acc2 + s.testCases.length, 0), 0
    )

    const notStartedCount = totalTestCases // Assuming for now, can be updated with real logic later

    return (
        <div className="summary-view-detailed">
            {/* Top Stats Cards */}
            <div className="summary-stats-row">
                <div className="stat-card">
                    <h3>Test Cases</h3>
                    <p className="stat-number">{totalTestCases}</p>
                    <p className="stat-label">{modules.length} Test Modules</p>
                </div>
                <div className="stat-card">
                    <h3>Test Results</h3>
                    <p className="stat-number">{testResults.length}</p>
                    <p className="stat-label">Executed Tests</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="summary-main-grid">
                {/* Left: Summary Table */}
                <div className="summary-section">
                    <h2>Summary</h2>
                    <div className="summary-modules-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Modules</th>
                                    <th>Passed</th>
                                    <th>Failed</th>
                                    <th>Skipped</th>
                                    <th>Not Started</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modules.map(module => {
                                    const totalTests = module.scenarios.reduce((acc, s) => acc + s.testCases.length, 0)
                                    return (
                                        <tr key={module.id}>
                                            <td>{module.name} ({totalTests})</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>{totalTests}</td>
                                        </tr>
                                    )
                                })}
                                <tr className="total-row">
                                    <td>Total ({totalTestCases})</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>{totalTestCases}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Status Chart & History */}
                <div className="summary-right-panel">
                    {/* Status Chart */}
                    <div className="status-section">
                        <h3>Status</h3>
                        <div className="status-chart">
                            <svg viewBox="0 0 200 200" className="donut-chart">
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="80"
                                    fill="none"
                                    stroke="#f59e0b"
                                    strokeWidth="40"
                                />
                                <text x="100" y="105" textAnchor="middle" className="chart-text">
                                    100.0%
                                </text>
                            </svg>
                        </div>
                        <div className="status-legend">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Count</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><span className="legend-dot passed"></span> Passed</td>
                                        <td>0</td>
                                        <td>0.0%</td>
                                    </tr>
                                    <tr>
                                        <td><span className="legend-dot failed"></span> Failed</td>
                                        <td>0</td>
                                        <td>0.0%</td>
                                    </tr>
                                    <tr>
                                        <td><span className="legend-dot skipped"></span> Skipped</td>
                                        <td>0</td>
                                        <td>0.0%</td>
                                    </tr>
                                    <tr>
                                        <td><span className="legend-dot not-started"></span> Not Started</td>
                                        <td>{totalTestCases}</td>
                                        <td>100.0%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* History */}
                    <div className="history-section">
                        <h3>History</h3>
                        <div className="history-list">
                            <p className="empty-history">No history yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryView
