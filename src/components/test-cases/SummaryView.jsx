import React, { useMemo } from 'react'
import '../../pages/TestCasesNew.css'

const SummaryView = ({ modules, testResults }) => {

    // --- Stats Calculation ---
    // --- Stats Calculation (Cumulative) ---
    const stats = useMemo(() => {
        // Initialize counts
        const globalCounts = {
            Passed: 0,
            Failed: 0,
            Skipped: 0,
            Total: 0
        }

        const moduleStats = {}
        // Pre-fill from current modules to ensure all modules are listed even if no results
        modules.forEach(m => {
            moduleStats[m.name] = {
                name: m.name,
                Passed: 0, Failed: 0, Skipped: 0, Total: 0
            }
        })

        // Aggregate ALL history
        testResults.forEach(run => {
            if (run.details) {
                run.details.forEach(detail => {
                    const status = detail.result
                    const modName = detail.module || 'Unknown'

                    // Only count valid execution statuses
                    if (status === 'Passed' || status === 'Failed' || status === 'Skipped') {
                        // Global
                        globalCounts[status]++
                        globalCounts.Total++

                        // Module
                        if (!moduleStats[modName]) {
                            moduleStats[modName] = {
                                name: modName,
                                Passed: 0, Failed: 0, Skipped: 0, Total: 0
                            }
                        }
                        moduleStats[modName][status]++
                        moduleStats[modName].Total++
                    }
                })
            }
        })

        return { globalCounts, moduleStats }
    }, [modules, testResults])

    // --- Chart Helpers ---
    const { globalCounts, moduleStats } = stats

    // Calculate chart Segments
    const radius = 80
    const circumference = 2 * Math.PI * radius
    let currentOffset = 0

    const chartSegments = [
        { label: 'Passed', count: globalCounts.Passed, color: '#22c55e' }, // Green
        { label: 'Failed', count: globalCounts.Failed, color: '#ef4444' }, // Red
        { label: 'Skipped', count: globalCounts.Skipped, color: '#94a3b8' }, // Gray
    ].map(item => {
        const pct = globalCounts.Total > 0 ? item.count / globalCounts.Total : 0
        const segmentLength = pct * circumference
        const segment = {
            ...item,
            pct: (pct * 100).toFixed(1),
            strokeDasharray: `${segmentLength} ${circumference}`,
            strokeDashoffset: -currentOffset
        }
        currentOffset += segmentLength
        return segment
    })

    return (
        <div className="summary-view-detailed">
            {/* Top Stats Cards */}
            <div className="summary-stats-row">
                <div className="stat-card">
                    <h3>Test Cases</h3>
                    <p className="stat-number">{stats.globalCounts.Total}</p>
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
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(moduleStats).map(m => (
                                    <tr key={m.name}>
                                        <td>{m.name} ({m.Total})</td>
                                        <td className={m.Passed > 0 ? "text-success" : ""}>{m.Passed}</td>
                                        <td className={m.Failed > 0 ? "text-danger" : ""}>{m.Failed}</td>
                                        <td>{m.Skipped}</td>
                                    </tr>
                                ))}
                                <tr className="total-row">
                                    <td>Total ({globalCounts.Total})</td>
                                    <td>{globalCounts.Passed}</td>
                                    <td>{globalCounts.Failed}</td>
                                    <td>{globalCounts.Skipped}</td>
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
                                {/* Background Circle */}
                                <circle cx="100" cy="100" r="80" fill="none" stroke="#f1f5f9" strokeWidth="20" />

                                {/* Dynamic Segments */}
                                {chartSegments.map((segment, index) => (
                                    <circle
                                        key={segment.label}
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke={segment.color}
                                        strokeWidth="20"
                                        strokeDasharray={segment.strokeDasharray}
                                        strokeDashoffset={segment.strokeDashoffset}
                                        transform="rotate(-90 100 100)"
                                        style={{ transition: 'all 0.5s ease-out' }}
                                    />
                                ))}

                                {/* Center Text */}
                                <text x="100" y="105" textAnchor="middle" className="chart-text">
                                    {chartSegments.find(s => s.label === 'Passed')?.pct}%
                                </text>
                                <text x="100" y="125" textAnchor="middle" fontSize="10" fill="#64748b">
                                    Passed
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
                                    {chartSegments.map(row => (
                                        <tr key={row.label}>
                                            <td><span className={`legend-dot ${row.label.toLowerCase().replace(' ', '-')}`} style={{ background: row.color }}></span> {row.label}</td>
                                            <td>{row.count}</td>
                                            <td>{row.pct}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* History */}
                    <div className="history-section">
                        <h3>History</h3>
                        <div className="history-list">
                            {testResults.length === 0 ? (
                                <p className="empty-history">No history yet</p>
                            ) : (
                                testResults.slice(0, 5).map(run => (
                                    <div key={run.id} className="history-item">
                                        <div className="history-info">
                                            <span className="history-plan">{run.planName}</span>
                                            <span className="history-date">{new Date(run.executedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="history-tags">
                                            {run.passed > 0 && <span className="tag passed">{run.passed} Pass</span>}
                                            {run.failed > 0 && <span className="tag failed">{run.failed} Fail</span>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SummaryView
