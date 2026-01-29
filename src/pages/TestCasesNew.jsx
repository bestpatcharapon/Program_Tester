import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, ChevronDown, ChevronRight, Edit, Trash2, Play, MoreVertical, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './TestCasesNew.css'

// Internal Components
import SummaryView from '../components/test-cases/SummaryView'
import TestCasesList from '../components/test-cases/TestCasesList'
import TestPlansView from '../components/test-cases/TestPlansView'
import TestResultsListView from '../components/test-cases/TestResultsListView'
import SimpleInputModal from '../components/test-cases/SimpleInputModal'
import TestCaseModal from '../components/test-cases/TestCaseModal'
import TestPlanModal from '../components/test-cases/TestPlanModal'

// Memoized Components
const MemoizedSummaryView = React.memo(SummaryView)
const MemoizedTestCasesList = React.memo(TestCasesList)
const MemoizedTestPlansView = React.memo(TestPlansView)
const MemoizedTestResultsListView = React.memo(TestResultsListView)

const TestCasesNew = () => {
    const navigate = useNavigate()

    // --- State Management ---
    const loadFromStorage = (key, defaultValue) => {
        try {
            const saved = localStorage.getItem(key)
            return saved ? JSON.parse(saved) : defaultValue
        } catch (error) {
            console.error('Error loading from localStorage:', error)
            return defaultValue
        }
    }

    const [modules, setModules] = useState(() => loadFromStorage('testModules', []))
    const [testPlans, setTestPlans] = useState(() => loadFromStorage('testPlans', []))
    const [testResults, setTestResults] = useState(() => loadFromStorage('testResults', []))

    // UI State
    const [activeTab, setActiveTab] = useState('summary')
    const [searchQuery, setSearchQuery] = useState('')

    // Modal Visibility State
    const [showModuleModal, setShowModuleModal] = useState(false)
    const [showScenarioModal, setShowScenarioModal] = useState(false)
    const [showTestCaseModal, setShowTestCaseModal] = useState(false)
    const [showTestPlanModal, setShowTestPlanModal] = useState(false)

    // Selection/Editing Context
    const [selectedModule, setSelectedModule] = useState(null)
    const [selectedScenario, setSelectedScenario] = useState(null)
    const [editingTestCaseData, setEditingTestCaseData] = useState(null) // If null -> Create Mode
    const [editingModuleData, setEditingModuleData] = useState(null) // For module edit
    const [editingScenarioData, setEditingScenarioData] = useState(null) // For scenario edit
    const [editingTestPlanData, setEditingTestPlanData] = useState(null) // For plan edit
    const [editingResultData, setEditingResultData] = useState(null) // For result edit (rename)
    const [showResultRenameModal, setShowResultRenameModal] = useState(false)

    // --- Effects ---
    useEffect(() => {
        localStorage.setItem('testModules', JSON.stringify(modules))
    }, [modules])

    useEffect(() => {
        localStorage.setItem('testPlans', JSON.stringify(testPlans))
    }, [testPlans])

    // Load results on mount or tab change to ensure freshness
    useEffect(() => {
        const savedResults = loadFromStorage('testResults', [])
        setTestResults(savedResults)
    }, [activeTab])

    const saveTestResults = (newResults) => {
        setTestResults(newResults)
        localStorage.setItem('testResults', JSON.stringify(newResults))
    }

    // --- Helpers ---
    const getAllTestCases = useCallback(() => {
        const allTestCases = []
        modules.forEach(module => {
            module.scenarios.forEach(scenario => {
                scenario.testCases.forEach(testCase => {
                    allTestCases.push({
                        ...testCase,
                        moduleName: module.name,
                        scenarioName: scenario.name,
                        moduleId: module.id,
                        scenarioId: scenario.id
                    })
                })
            })
        })
        return allTestCases
    }, [modules])

    // --- Handlers: Modules ---
    const handleOpenAddModule = useCallback(() => {
        setEditingModuleData(null)
        setShowModuleModal(true)
    }, [])

    const handleEditModule = useCallback((module) => {
        setEditingModuleData(module)
        setShowModuleModal(true)
    }, [])

    const handleSaveModule = useCallback((moduleName) => {
        if (editingModuleData) {
            // Update
            setModules(prev => prev.map(m => m.id === editingModuleData.id ? { ...m, name: moduleName } : m))
        } else {
            // Create
            setModules(prev => [...prev, {
                id: Date.now(),
                name: moduleName,
                expanded: true,
                scenarios: []
            }])
        }
    }, [editingModuleData])

    const handleDeleteModule = useCallback((moduleId) => {
        if (confirm('Are you sure you want to delete this module? This will also delete all scenarios and test cases within it.')) {
            setModules(prev => prev.filter(m => m.id !== moduleId))
        }
    }, [])

    const toggleModule = useCallback((moduleId) => {
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, expanded: !m.expanded } : m))
    }, [])


    // --- Handlers: Scenarios ---
    const handleOpenAddScenario = useCallback((module) => {
        setSelectedModule(module)
        setEditingScenarioData(null) // Create mode
        setShowScenarioModal(true)
    }, [])

    const handleEditScenario = useCallback((module, scenario) => {
        setSelectedModule(module)
        setEditingScenarioData(scenario)
        setShowScenarioModal(true)
    }, [])

    const handleSaveScenario = useCallback((scenarioName) => {
        if (!selectedModule) return

        if (editingScenarioData) {
            // Update
            setModules(prev => prev.map(m =>
                m.id === selectedModule.id ? {
                    ...m,
                    scenarios: m.scenarios.map(s =>
                        s.id === editingScenarioData.id ? { ...s, name: scenarioName } : s
                    )
                } : m
            ))
        } else {
            // Create
            setModules(prev => prev.map(m =>
                m.id === selectedModule.id ? {
                    ...m,
                    scenarios: [...m.scenarios, {
                        id: Date.now(),
                        name: scenarioName,
                        expanded: true,
                        testCases: []
                    }]
                } : m
            ))
        }
    }, [selectedModule, editingScenarioData])

    const handleDeleteScenario = useCallback((moduleId, scenarioId) => {
        if (confirm('Are you sure you want to delete this scenario? All test cases within it will be lost.')) {
            setModules(prev => prev.map(m =>
                m.id === moduleId ? {
                    ...m,
                    scenarios: m.scenarios.filter(s => s.id !== scenarioId)
                } : m
            ))
        }
    }, [])

    const toggleScenario = useCallback((moduleId, scenarioId) => {
        setModules(prev => prev.map(m =>
            m.id === moduleId ? {
                ...m,
                scenarios: m.scenarios.map(s =>
                    s.id === scenarioId ? { ...s, expanded: !s.expanded } : s
                )
            } : m
        ))
    }, [])

    // --- Handlers: Test Cases ---
    const handleOpenAddTestCase = useCallback((module, scenario) => {
        setSelectedModule(module)
        setSelectedScenario(scenario)
        setEditingTestCaseData(null) // Create mode
        setShowTestCaseModal(true)
    }, [])

    const handleEditTestCase = useCallback((module, scenario, testCase) => {
        setSelectedModule(module)
        setSelectedScenario(scenario)
        setEditingTestCaseData(testCase) // Edit mode
        setShowTestCaseModal(true)
    }, [])

    const handleSaveTestCase = useCallback((caseData) => {
        if (!selectedModule || !selectedScenario) return

        if (editingTestCaseData) {
            // Update
            setModules(prev => prev.map(m =>
                m.id === selectedModule.id ? {
                    ...m,
                    scenarios: m.scenarios.map(s =>
                        s.id === selectedScenario.id ? {
                            ...s,
                            testCases: s.testCases.map(tc =>
                                tc.id === editingTestCaseData.id ? {
                                    ...caseData,
                                    id: caseData.id, // ID might have been edited
                                    status: tc.status
                                } : tc
                            )
                        } : s
                    )
                } : m
            ))
        } else {
            // Create
            setModules(prev => prev.map(m =>
                m.id === selectedModule.id ? {
                    ...m,
                    scenarios: m.scenarios.map(s =>
                        s.id === selectedScenario.id ? {
                            ...s,
                            testCases: [...s.testCases, {
                                ...caseData,
                                status: 'Not Started'
                            }]
                        } : s
                    )
                } : m
            ))
        }
    }, [selectedModule, selectedScenario, editingTestCaseData])

    const deleteTestCase = useCallback((moduleId, scenarioId, testCaseId) => {
        if (confirm('Are you sure you want to delete this test case?')) {
            setModules(prev => prev.map(m =>
                m.id === moduleId ? {
                    ...m,
                    scenarios: m.scenarios.map(s =>
                        s.id === scenarioId ? {
                            ...s,
                            testCases: s.testCases.filter(tc => tc.id !== testCaseId)
                        } : s
                    )
                } : m
            ))
        }
    }, [])

    // --- Handlers: Test Plans ---
    const handleOpenAddPlan = useCallback(() => {
        setEditingTestPlanData(null)
        setShowTestPlanModal(true)
    }, [])

    const handleEditTestPlan = useCallback((plan) => {
        setEditingTestPlanData(plan)
        setShowTestPlanModal(true)
    }, [])

    const handleSaveTestPlan = useCallback((planData) => {
        if (editingTestPlanData) {
            // Update
            setTestPlans(prev => prev.map(p =>
                p.id === editingTestPlanData.id ? {
                    ...p,
                    ...planData,
                    id: editingTestPlanData.id // Keep original ID 
                } : p
            ))
        } else {
            // Create
            setTestPlans(prev => [...prev, { ...planData, createdAt: new Date().toISOString() }])
        }
    }, [editingTestPlanData])

    const handleDeletePlan = useCallback((planId) => {
        if (confirm('Are you sure you want to delete this test plan?')) {
            setTestPlans(prev => prev.filter(p => p.id !== planId))
        }
    }, [])

    const runTestPlan = useCallback((plan) => {
        // Navigate to execution view
        navigate('/test-results', { state: { testPlan: plan, allTestCases: getAllTestCases() } })
    }, [navigate, getAllTestCases])

    // --- Handlers: Test Results ---
    const handleEditResult = useCallback((result) => {
        setEditingResultData(result)
        setShowResultRenameModal(true)
    }, [])

    const handleSaveResultRename = useCallback((newName) => {
        if (editingResultData) {
            const updatedResults = testResults.map(r =>
                r.id === editingResultData.id ? { ...r, planName: newName } : r
            )
            saveTestResults(updatedResults)
        }
    }, [testResults, editingResultData])

    const handleDeleteResult = useCallback((resultId) => {
        if (confirm('Are you sure you want to delete this test result? This action cannot be undone.')) {
            const updatedResults = testResults.filter(r => r.id !== resultId)
            saveTestResults(updatedResults)
        }
    }, [testResults])

    const handleShareResult = useCallback((resultId) => {
        // Simulate share - copy link to clipboard or json
        // In a real app this might generate a shareable URL
        const result = testResults.find(r => r.id === resultId)
        if (result) {
            const shareText = `Test Result: ${result.planName}\nExecuted: ${new Date(result.executedAt).toLocaleString()}\nPassed: ${result.passed}, Failed: ${result.failed}`
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Test result summary copied to clipboard!')
            })
        }
    }, [testResults])


    return (
        <div className="test-cases-new-page">
            <div className="test-cases-new-header">
                <div>
                    <h1>Test Cases Management</h1>
                    <p>จัดการ Test Cases แบบมีโครงสร้าง</p>
                </div>
                <div className="header-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search test cases..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
                {['summary', 'test-cases', 'test-plans', 'test-results'].map(tab => (
                    <button
                        key={tab}
                        className={`tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                ))}
            </div>

            <div className="test-cases-new-content">
                {activeTab === 'summary' && (
                    <MemoizedSummaryView modules={modules} testResults={testResults} />
                )}

                {activeTab === 'test-cases' && (
                    <MemoizedTestCasesList
                        modules={modules}
                        toggleModule={toggleModule}
                        toggleScenario={toggleScenario}
                        onOpenAddModule={handleOpenAddModule}
                        onOpenAddScenario={handleOpenAddScenario}
                        onOpenAddTestCase={handleOpenAddTestCase}
                        onEditModule={handleEditModule}
                        onDeleteModule={handleDeleteModule}
                        onEditScenario={handleEditScenario}
                        onDeleteScenario={handleDeleteScenario}
                        onEditTestCase={handleEditTestCase}
                        onDeleteTestCase={deleteTestCase}
                    />
                )}

                {activeTab === 'test-plans' && (
                    <MemoizedTestPlansView
                        testPlans={testPlans}
                        testResults={testResults}
                        allTestCases={getAllTestCases()}
                        onOpenAddPlan={handleOpenAddPlan}
                        onRunPlan={runTestPlan}
                        onEditPlan={handleEditTestPlan}
                        onDeletePlan={handleDeletePlan}
                    />
                )}

                {activeTab === 'test-results' && (
                    <MemoizedTestResultsListView
                        testResults={testResults}
                        onEditResult={handleEditResult}
                        onDeleteResult={handleDeleteResult}
                        onShareResult={handleShareResult}
                    />
                )}
            </div>

            {/* --- Modals --- */}

            <SimpleInputModal
                isOpen={showModuleModal}
                onClose={() => setShowModuleModal(false)}
                onSave={handleSaveModule}
                title={editingModuleData ? "Edit Test Module" : "Add New Test Module"}
                label="Module Name"
                placeholder="e.g., การเข้าสู่ระบบ"
                initialValue={editingModuleData ? editingModuleData.name : ''}
            />

            <SimpleInputModal
                isOpen={showScenarioModal}
                onClose={() => setShowScenarioModal(false)}
                onSave={handleSaveScenario}
                title={editingScenarioData ? "Edit Test Scenario" : "Add New Test Scenario"}
                label="Scenario Name"
                placeholder="e.g., ผู้ใช้เข้าสู่ระบบ"
                initialValue={editingScenarioData ? editingScenarioData.name : ''}
            />

            <TestCaseModal
                isOpen={showTestCaseModal}
                onClose={() => setShowTestCaseModal(false)}
                onSave={handleSaveTestCase}
                initialData={editingTestCaseData}
                mode={editingTestCaseData ? 'edit' : 'create'}
            />

            <TestPlanModal
                isOpen={showTestPlanModal}
                onClose={() => setShowTestPlanModal(false)}
                onSave={handleSaveTestPlan}
                testModules={modules}
                initialData={editingTestPlanData}
            />

            <SimpleInputModal
                isOpen={showResultRenameModal}
                onClose={() => setShowResultRenameModal(false)}
                onSave={handleSaveResultRename}
                title="Rename Test Result"
                label="Result Title"
                placeholder="e.g., Weekly Regression Test"
                initialValue={editingResultData ? editingResultData.planName : ''}
            />
        </div>
    )
}

export default TestCasesNew
