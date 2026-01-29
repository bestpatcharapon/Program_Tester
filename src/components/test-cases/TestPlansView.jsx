import React from 'react'
import { Plus, Edit, Trash2, Play, Copy, Calendar } from 'lucide-react'
import '../../pages/TestCasesNew.css'

const TestPlansView = ({ testPlans, testResults = [], allTestCases, onOpenAddPlan, onRunPlan, onDeletePlan, onEditPlan, onDuplicatePlan }) => {

    // Helper to find latest result for a plan
    const getLatestResult = (planId) => {
        if (!testResults || testResults.length === 0) return null
        // Assuming testResults have planId. If not, fallback might be needed or data fix.
        // We filter by planId (converted to string just in case)
        const planResults = testResults.filter(r => String(r.planId) === String(planId) || r.id === planId) // Safe match check
        if (planResults.length === 0) return null
        return planResults.sort((a, b) => new Date(b.executedAt) - new Date(a.executedAt))[0]
    }

    const formatDate = (isoString) => {
        if (!isoString) return '-'
        return new Date(isoString).toLocaleString('th-TH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    return (
        <div className="test-plans-view">
            <div className="test-plans-header">
                <h2>Test Plans</h2>
                <button
                    className="btn-primary"
                    onClick={onOpenAddPlan}
                >
                    <Plus size={18} />
                    Add Test Plan
                </button>
            </div>

            <div className="test-plans-table-container">
                {testPlans.length === 0 ? (
                    <div className="empty-state">
                        <p>No test plans yet</p>
                        <button
                            className="btn-secondary"
                            onClick={onOpenAddPlan}
                        >
                            Add First Test Plan
                        </button>
                    </div>
                ) : (
                    <table className="test-plans-table-new">
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}>ID</th>
                                <th style={{ width: '30%' }}>Title</th>
                                <th style={{ width: '10%' }}>% Done</th>
                                <th style={{ width: '20%' }}>Last Test Results</th>
                                <th style={{ width: '15%' }}>Test At</th>
                                <th style={{ width: '15%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testPlans.map(plan => {
                                const latestResult = getLatestResult(plan.id)
                                const pctDone = latestResult
                                    ? Math.round(((latestResult.passed + latestResult.failed + latestResult.skipped) / latestResult.total) * 100)
                                    : 0

                                // Mock "Test At" from plan creation if never run, or just '-'
                                const testDate = latestResult ? latestResult.executedAt : null

                                return (
                                    <tr key={plan.id}>
                                        <td className="plan-id">TP-{plan.id}</td>
                                        <td className="plan-title">{plan.title}</td>
                                        <td className="plan-pct">{pctDone.toFixed(2)}%</td>
                                        <td className="plan-results">
                                            {latestResult ? (
                                                <div className="mini-stats-bar">
                                                    <div className="stat-box passed" title="Passed">{latestResult.passed}</div>
                                                    <div className="stat-box failed" title="Failed">{latestResult.failed}</div>
                                                    <div className="stat-box skipped" title="Skipped">{latestResult.skipped}</div>
                                                    <div className="stat-box pending" title="Pending">{latestResult.total - (latestResult.passed + latestResult.failed + latestResult.skipped)}</div>
                                                </div>
                                            ) : (
                                                <span className="no-result">-</span>
                                            )}
                                        </td>
                                        <td className="plan-date">{formatDate(testDate)}</td>
                                        <td className="actions">
                                            <button
                                                className="icon-btn-plain"
                                                title="Run"
                                                onClick={() => onRunPlan(plan)}
                                            >
                                                <Play size={16} />
                                            </button>
                                            <button
                                                className="icon-btn-plain"
                                                title="Edit"
                                                onClick={() => onEditPlan(plan)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="icon-btn-plain"
                                                title="Duplicate"
                                                onClick={() => onDuplicatePlan && onDuplicatePlan(plan)}
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button
                                                className="icon-btn-plain danger"
                                                title="Delete"
                                                onClick={() => onDeletePlan(plan.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <style>{`
                .test-plans-table-container {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                .test-plans-table-new {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.875rem;
                }
                .test-plans-table-new th {
                    text-align: left;
                    padding: 1rem;
                    background: #f8fafc;
                    border-bottom: 2px solid #e2e8f0;
                    color: #64748b;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                }
                .test-plans-table-new td {
                    padding: 1rem;
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: middle;
                    color: #334155;
                }
                .test-plans-table-new tr:last-child td {
                    border-bottom: none;
                }
                .test-plans-table-new tr:hover {
                    background-color: #f8fafc;
                }
                .plan-id {
                    font-weight: 600;
                    color: #0f172a;
                }
                .plan-title {
                    font-weight: 500;
                    color: #2563eb;
                }
                .plan-pct {
                    color: #64748b;
                }
                .mini-stats-bar {
                    display: flex;
                    gap: 4px;
                }
                .stat-box {
                    min-width: 24px;
                    padding: 0 4px;
                    height: 18px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: bold;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .stat-box.passed { background-color: #84cc16; } /* Lime 500 */
                .stat-box.failed { background-color: #ef4444; } /* Red 500 */
                .stat-box.skipped { background-color: #e2e8f0; color: #64748b; } /* Slate 200 */
                .stat-box.pending { background-color: #fbbf24; } /* Amber 400 */
                
                .icon-btn-plain {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #64748b;
                    padding: 4px;
                    transition: color 0.15s;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon-btn-plain:hover {
                    color: #0f172a;
                }
                .icon-btn-plain.danger:hover {
                    color: #ef4444;
                }
                .actions {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }
            `}</style>
        </div>
    )
}

export default TestPlansView
