import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Eye, Calendar, User, Edit, Share2, Trash2 } from 'lucide-react'
import '../../pages/TestCasesNew.css'

const TestResultsListView = ({ testResults, onEditResult, onDeleteResult, onShareResult }) => {
    const [expandedResults, setExpandedResults] = useState([])

    // Handlers
    const handleShare = (id) => {
        if (onShareResult) onShareResult(id)
    }

    const handleEdit = (result) => {
        if (onEditResult) onEditResult(result)
    }

    const handleDelete = (id) => {
        if (onDeleteResult) onDeleteResult(id)
    }

    if (!testResults || testResults.length === 0) {
        return (
            <div className="test-results-view">
                <div className="test-results-header">
                    <h2>Test Results History</h2>
                </div>
                <div className="test-results-table">
                    <div className="empty-state">
                        <p>No test results yet</p>
                        <p className="empty-hint">Run a test plan to see results here</p>
                    </div>
                </div>
            </div>
        )
    }

    const formatDate = (isoString) => {
        try {
            return new Date(isoString).toLocaleString('th-TH', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        } catch (e) {
            return isoString
        }
    }

    return (
        <div className="test-results-view">
            <div className="test-results-header">
                <h2>Test Results History</h2>
            </div>

            <div className="results-table-container">
                <table className="results-history-table">
                    <thead>
                        <tr>
                            <th style={{ width: '120px' }}>ID</th>
                            <th>Title</th>
                            <th style={{ width: '180px' }}>Last Updated</th>
                            <th style={{ width: '100px' }}>% Done</th>
                            <th style={{ width: '200px' }}>Results</th>
                            <th style={{ width: '180px' }}>Latest Tester</th>
                            <th style={{ width: '120px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testResults.map(result => {
                            const pctDone = Math.round(((result.passed + result.failed + result.skipped) / result.total) * 100) || 0
                            return (
                                <React.Fragment key={result.id}>
                                    <tr className="result-row" onClick={() => toggleResult(result.id)}>
                                        <td className="result-id">{result.id}</td>
                                        <td className="result-title">
                                            {result.planName}
                                        </td>
                                        <td className="result-date">{formatDate(result.executedAt)}</td>
                                        <td className="result-pct">{pctDone.toFixed(2)}%</td>
                                        <td className="result-bar-cell">
                                            <div className="mini-progress-bar">
                                                <div className="mini-seg passed" style={{ flex: result.passed }} title={`Passed: ${result.passed}`}>{result.passed > 0 && result.passed}</div>
                                                <div className="mini-seg failed" style={{ flex: result.failed }} title={`Failed: ${result.failed}`}>{result.failed > 0 && result.failed}</div>
                                                <div className="mini-seg skipped" style={{ flex: result.skipped }} title={`Skipped: ${result.skipped}`}>{result.skipped > 0 && result.skipped}</div>
                                                <div className="mini-seg pending" style={{ flex: result.notTested }} title={`Pending: ${result.notTested}`}></div>
                                            </div>
                                        </td>
                                        <td className="result-tester">
                                            Tester Name
                                        </td>
                                        <td className="result-actions">
                                            <button className="icon-btn" title="Edit" onClick={(e) => { e.stopPropagation(); handleEdit(result) }}><Edit size={16} /></button>
                                            <button className="icon-btn" title="Share" onClick={(e) => { e.stopPropagation(); handleShare(result.id) }}><Share2 size={16} /></button>
                                            <button className="icon-btn danger" title="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(result.id) }}><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                    {expandedResults.includes(result.id) && (
                                        <tr className="result-details-row">
                                            <td colSpan="7">
                                                <div className="details-expanded">
                                                    <table className="test-cases-table">
                                                        <thead>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>Test Case</th>
                                                                <th>Result</th>
                                                                <th>Comments</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {result.details && result.details.map((detail, idx) => (
                                                                <tr key={`${result.id}-${detail.id}-${idx}`}>
                                                                    <td className="tc-id">{detail.id}</td>
                                                                    <td>{detail.name || 'Test Case'}</td>
                                                                    <td>
                                                                        <span className={`status-badge ${detail.result?.toLowerCase()}`}>
                                                                            {detail.result || 'Not Tested'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="comments-cell">{detail.comments || '-'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <style>{`
                .results-history-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.875rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .results-history-table th {
                    text-align: left;
                    padding: 1rem;
                    background: #f8fafc;
                    border-bottom: 2px solid #e2e8f0;
                    color: #64748b;
                    font-weight: 600;
                }
                .results-history-table td {
                    padding: 1rem;
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: middle;
                }
                .result-row:hover {
                    background: #f8fafc;
                    cursor: pointer;
                }
                .result-id {
                    font-weight: 700;
                    color: #0f172a;
                }
                .result-title {
                    font-weight: 500;
                    color: #3b82f6;
                }
                .result-pct {
                    font-weight: 600;
                    color: #64748b;
                }
                .mini-progress-bar {
                    display: flex;
                    height: 16px;
                    border-radius: 4px;
                    overflow: hidden;
                    width: 100%;
                    background: #e2e8f0;
                    font-size: 10px;
                    color: white;
                    font-weight: bold;
                    text-align: center;
                    line-height: 16px;
                }
                .mini-seg.passed { background: #84cc16; }
                .mini-seg.failed { background: #ef4444; }
                .mini-seg.skipped { background: #eab308; }
                .mini-seg.pending { background: #e2e8f0; }
                
                .result-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .icon-btn {
                    background: none;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    padding: 4px;
                    cursor: pointer;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon-btn:hover {
                    background: #f1f5f9;
                    color: #0f172a;
                }
                .icon-btn.danger:hover {
                    background: #fee2e2;
                    color: #ef4444;
                    border-color: #fecaca;
                }
                .details-expanded {
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 6px;
                    margin: 0.5rem;
                    border: 1px solid #e2e8f0;
                }
            `}</style>
        </div>
    )
}

export default TestResultsListView
