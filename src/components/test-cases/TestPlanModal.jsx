import React, { useState, useMemo, useEffect } from 'react'
import { X, ChevronDown, Search } from 'lucide-react'
import '../../pages/TestCasesNew.css'

const TestPlanModal = ({ isOpen, onClose, onSave, testModules, initialData }) => {
    const [title, setTitle] = useState('')
    const [planId, setPlanId] = useState('')
    const [selectedCases, setSelectedCases] = useState([])

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Edit Mode
                setTitle(initialData.title)
                setPlanId(initialData.id)
                setSelectedCases(initialData.testCases || [])
            } else {
                // Create Mode
                setTitle('')
                setPlanId(`TP-${Date.now()}`)
                setSelectedCases([])
            }
        }
    }, [isOpen, initialData])
    const allTestCases = useMemo(() => {
        const cases = []
        testModules.forEach(module => {
            module.scenarios.forEach(scenario => {
                scenario.testCases.forEach(testCase => {
                    cases.push({
                        ...testCase,
                        moduleName: module.name,
                        scenarioName: scenario.name,
                        moduleId: module.id,
                        scenarioId: scenario.id
                    })
                })
            })
        })
        return cases
    }, [testModules])

    if (!isOpen) return null

    const handleSave = () => {
        if (!title.trim()) {
            alert('Please enter a test plan name')
            return
        }
        onSave({
            id: planId || `TP-${Date.now()}`,
            title,
            testCases: selectedCases
        })
        // Reset
        setTitle('')
        setPlanId('')
        setSelectedCases([])
        onClose()
    }

    const toggleTestCase = (id) => {
        setSelectedCases(prev =>
            prev.includes(id) ? prev.filter(tcId => tcId !== id) : [...prev, id]
        )
    }

    const toggleModule = (moduleId, checked) => {
        const moduleCases = allTestCases.filter(tc => tc.moduleId === moduleId).map(tc => tc.id)
        if (checked) {
            setSelectedCases(prev => [...new Set([...prev, ...moduleCases])])
        } else {
            setSelectedCases(prev => prev.filter(id => !moduleCases.includes(id)))
        }
    }

    const toggleAll = (checked) => {
        if (checked) {
            setSelectedCases(allTestCases.map(tc => tc.id))
        } else {
            setSelectedCases([])
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-test-plan" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="breadcrumb">
                        <span>All Projects</span>
                        <span className="separator">›</span>
                        <span>CCT M15 Development</span>
                        <span className="separator">›</span>
                        <span>Test Plans</span>
                        <span className="separator">›</span>
                        <span className="current">New Test Plan</span>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <h1 className="plan-title">New Test Plan</h1>

                <div className="plan-form-row">
                    <div className="form-group-inline">
                        <label>ID</label>
                        <input
                            type="text"
                            placeholder="TP-003"
                            value={planId}
                            onChange={(e) => setPlanId(e.target.value)}
                        />
                    </div>
                    <div className="form-group-inline">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Input test plan name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </div>

                <div className="test-cases-section">
                    <h3>Test Cases</h3>
                    <div className="test-cases-container">
                        {/* Left: Test Modules Tree */}
                        <div className="modules-tree">
                            <div className="tree-header">
                                <h4>Test Modules</h4>
                            </div>
                            <div className="tree-content">
                                <label className="tree-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedCases.length === allTestCases.length && allTestCases.length > 0}
                                        onChange={(e) => toggleAll(e.target.checked)}
                                    />
                                    <span className="tree-icon">📁</span>
                                    <span>All Test Cases</span>
                                </label>
                                {testModules.map(module => {
                                    const moduleCaseIds = allTestCases.filter(tc => tc.moduleId === module.id).map(tc => tc.id)
                                    const isAllSelected = moduleCaseIds.length > 0 && moduleCaseIds.every(id => selectedCases.includes(id))
                                    const isPartiallySelected = moduleCaseIds.some(id => selectedCases.includes(id)) && !isAllSelected

                                    return (
                                        <div key={module.id} className="tree-module">
                                            <label className="tree-item">
                                                <input
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    ref={input => {
                                                        if (input) input.indeterminate = isPartiallySelected
                                                    }}
                                                    onChange={(e) => toggleModule(module.id, e.target.checked)}
                                                />
                                                <ChevronDown size={14} />
                                                <span>{module.name} ({moduleCaseIds.length})</span>
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Right: All Cases List */}
                        <div className="cases-list">
                            <div className="cases-header">
                                <h4>All Cases</h4>
                                <div className="search-box-small">
                                    <Search size={16} />
                                    <input type="text" placeholder="Search Test Cases" />
                                </div>
                            </div>
                            <div className="cases-content">
                                {allTestCases.length === 0 ? (
                                    <p className="empty-message">No test cases available. Create test cases first.</p>
                                ) : (
                                    <table className="cases-table">
                                        <thead>
                                            <tr>
                                                <th width="50">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCases.length === allTestCases.length && allTestCases.length > 0}
                                                        onChange={(e) => toggleAll(e.target.checked)}
                                                    />
                                                </th>
                                                <th>Module</th>
                                                <th>ID</th>
                                                <th>Test Case Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allTestCases.map(tc => (
                                                <tr key={tc.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCases.includes(tc.id)}
                                                            onChange={() => toggleTestCase(tc.id)}
                                                        />
                                                    </td>
                                                    <td>{tc.moduleName}</td>
                                                    <td className="tc-id">{tc.id}</td>
                                                    <td>{tc.name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            <div className="cases-footer">
                                <span>{selectedCases.length} of {allTestCases.length} selected</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handleSave}>
                        Create Plan
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TestPlanModal
