import React, { useState, useEffect, useMemo } from 'react'
import { Search, Share2, Download, Book } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import './TestResults.css'
import TestExecutionModal from '../components/test-cases/TestExecutionModal'

const TestResults = () => {
    const navigate = useNavigate()
    const location = useLocation()

    // --- State Initialization ---

    // Check if we have state passed from previous page
    const initialPlan = location.state?.testPlan
    const initialCases = location.state?.allTestCases || []

    const [testPlan, setTestPlan] = useState(initialPlan || { title: 'Manual Execution', id: 'MANUAL' })

    // If we have passed cases, format them. If not, use dummy data for visualization if user hits this page directly
    const [testCases, setTestCases] = useState(() => {
        if (initialCases.length > 0) {
            // Filter only cases in plan if it's a specific plan
            const planIds = initialPlan?.testCases || []
            const planCases = initialPlan ? initialCases.filter(tc => planIds.includes(tc.id)) : initialCases

            return planCases.map(tc => ({
                id: tc.id,
                name: tc.name,
                module: tc.moduleName || 'Unknown',
                scenario: tc.scenarioName || 'Unknown',
                steps: tc.steps || '',
                expectedResult: tc.expectedResult || '',
                reference: tc.reference || '',
                result: tc.result || 'Not Tested', // Default to 'Not Tested' instead of null for easier filtering
                comments: tc.comments || ''
            }))
        }
        return []
    })

    const [filterModule, setFilterModule] = useState('All Cases')
    const [searchQuery, setSearchQuery] = useState('')

    // Modal State
    const [modalOpen, setModalOpen] = useState(false)
    const [currentModalIndex, setCurrentModalIndex] = useState(0)


    // --- Derived State ---

    // 1. Unique Modules
    const uniqueModules = useMemo(() => {
        const modules = new Set(testCases.map(tc => tc.module))
        return ['All Cases', ...Array.from(modules)]
    }, [testCases])

    // 2. Filtered Cases
    const filteredCases = useMemo(() => {
        return testCases.filter(tc => {
            const matchesModule = filterModule === 'All Cases' || tc.module === filterModule
            const matchesSearch = tc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tc.id.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesModule && matchesSearch
        })
    }, [testCases, filterModule, searchQuery])

    // 3. Stats for Progress Bar
    const stats = useMemo(() => {
        const total = testCases.length
        if (total === 0) return { passed: 0, failed: 0, skipped: 0, notTested: 0, total: 0 }

        const passed = testCases.filter(tc => tc.result === 'Passed').length
        const failed = testCases.filter(tc => tc.result === 'Failed').length
        const skipped = testCases.filter(tc => tc.result === 'Skipped').length
        const notTested = total - passed - failed - skipped

        return {
            passed, failed, skipped, notTested, total,
            passedPct: (passed / total) * 100,
            failedPct: (failed / total) * 100,
            skippedPct: (skipped / total) * 100,
            notTestedPct: (notTested / total) * 100
        }
    }, [testCases])


    // --- Handlers ---

    const handleUpdateResult = (id, result, comments) => {
        setTestCases(prev => prev.map(tc =>
            tc.id === id ? { ...tc, result, comments } : tc
        ))
    }

    const openModal = (caseId) => {
        const index = testCases.findIndex(tc => tc.id === caseId)
        if (index !== -1) {
            setCurrentModalIndex(index)
            setModalOpen(true)
        }
    }

    const handleModalPrev = () => {
        if (currentModalIndex > 0) setCurrentModalIndex(currentModalIndex - 1)
    }

    const handleModalNext = () => {
        if (currentModalIndex < testCases.length - 1) setCurrentModalIndex(currentModalIndex + 1)
    }

    const handleSaveAndClose = () => {
        setModalOpen(false)
        // Optionally save to backend/localstorage here immediately
    }

    const handleFinishExecution = () => {
        // Prepare summary object
        const summary = {
            id: `TR-${Date.now()}`,
            planId: testPlan.id,
            planName: testPlan.title,
            executedAt: new Date().toISOString(),
            total: stats.total,
            passed: stats.passed,
            failed: stats.failed,
            skipped: stats.skipped,
            notTested: stats.notTested,
            details: testCases // Save all details
        }

        // Save to LocalStorage
        try {
            const existingResults = JSON.parse(localStorage.getItem('testResults') || '[]')
            const updatedResults = [summary, ...existingResults]
            localStorage.setItem('testResults', JSON.stringify(updatedResults))
            console.log('Saved Execution:', summary)
        } catch (error) {
            console.error('Failed to save:', error)
        }

        navigate('/testcases-new') // Go back to dashboard
    }

    // Current case for modal
    const currentCase = testCases[currentModalIndex]

    return (
        <div className="test-results-page-new">
            {/* Top Bar */}
            <div className="results-header-bar">
                <h1>{testPlan.title} - {new Date().toLocaleDateString('th-TH')}</h1>
                <div className="header-actions">
                    <button className="btn-share"><Share2 size={16} /> Share</button>
                    <button className="btn-export" onClick={handleFinishExecution}>Finish & Save</button>
                </div>
            </div>

            <div className="results-layout">
                {/* Left Sidebar */}
                <div className="results-sidebar">
                    <div className="sidebar-title">Test Modules</div>
                    {uniqueModules.map(mod => (
                        <div
                            key={mod}
                            className={`sidebar-item ${filterModule === mod ? 'active' : ''}`}
                            onClick={() => setFilterModule(mod)}
                        >
                            {mod === 'All Cases' ? <Book size={16} /> : null}
                            {mod}
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="results-main">
                    {/* Progress Stats */}
                    <div className="progress-container">
                        <div className="progress-bar-wrapper">
                            <div className="progress-segment green" style={{ width: `${stats.passedPct}%` }}></div>
                            <div className="progress-segment red" style={{ width: `${stats.failedPct}%` }}></div>
                            <div className="progress-segment yellow" style={{ width: `${stats.notTestedPct}%` }}></div> {/* Using yellow for pending/not tested visually or grey */}
                            <div className="progress-segment grey" style={{ width: `${stats.skippedPct}%` }}></div>
                        </div>
                        <div className="progress-labels">
                            <span>Passed: {stats.passed}</span>
                            <span>Failed: {stats.failed}</span>
                            <span>Remaining: {stats.notTested}</span>
                            <span>Skipped: {stats.skipped}</span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="results-search">
                        <div className="search-input-wrapper">
                            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search Test cases"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="tc-list">
                        {/* Group by Module if viewing All Cases? Or just simple list? Screenshot shows grouped by module headers */}
                        {filterModule === 'All Cases' ? (
                            uniqueModules.filter(m => m !== 'All Cases').map(mod => {
                                const modCases = filteredCases.filter(c => c.module === mod)
                                if (modCases.length === 0) return null
                                return (
                                    <div key={mod} className="module-section">
                                        <div className="module-header">{mod}</div>
                                        {modCases.map(tc => (
                                            <div key={tc.id} className="tc-row" onClick={() => openModal(tc.id)}>
                                                <div className="tc-info">
                                                    <span className="tc-id">{tc.id}</span>
                                                    <span>{tc.name}</span>
                                                </div>
                                                <div className={`status-pill ${tc.result?.toLowerCase().replace(' ', '')}`}>
                                                    {tc.result || 'Not Tested'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="module-section">
                                <div className="module-header">{filterModule}</div>
                                {filteredCases.map(tc => (
                                    <div key={tc.id} className="tc-row" onClick={() => openModal(tc.id)}>
                                        <div className="tc-info">
                                            <span className="tc-id">{tc.id}</span>
                                            <span>{tc.name}</span>
                                        </div>
                                        <div className={`status-pill ${tc.result?.toLowerCase().replace(' ', '')}`}>
                                            {tc.result || 'Not Tested'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <TestExecutionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                testCase={currentCase}
                currentIndex={currentModalIndex}
                totalCases={testCases.length}
                onPrev={handleModalPrev}
                onNext={handleModalNext}
                onUpdateResult={handleUpdateResult}
                onSaveAndClose={handleSaveAndClose}
            />
        </div>
    )
}

export default TestResults
