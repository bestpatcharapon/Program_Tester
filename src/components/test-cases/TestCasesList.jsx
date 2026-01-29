import React, { useState } from 'react'
import { Plus, ChevronDown, ChevronRight, Edit, Trash2, MoreVertical, Copy, Upload, RefreshCw } from 'lucide-react'
import '../../pages/TestCasesNew.css'

const TestCasesList = ({
    modules,
    toggleModule,
    toggleScenario,
    onOpenAddModule,
    onOpenAddScenario,
    onOpenAddTestCase,
    onEditTestCase,
    onDeleteTestCase,
    onEditModule,
    onDeleteModule,
    onEditScenario,
    onDeleteScenario
}) => {

    const [activeMenu, setActiveMenu] = useState(null) // { id: string, type: 'module'|'scenario' }

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.action-menu-container')) {
                setActiveMenu(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleMenu = (e, id, type) => {
        e.stopPropagation()
        if (activeMenu?.id === id && activeMenu?.type === type) {
            setActiveMenu(null)
        } else {
            setActiveMenu({ id, type })
        }
    }

    const handleDuplicateTestCase = (module, scenario, tc) => {
        alert(`Duplicate Test Case: ${tc.name}`)
    }

    // Determine current view (filtered or all) - For now just show all expanded
    return (
        <div className="test-cases-layout">
            {/* Sidebar - Test Modules */}
            <div className="modules-sidebar-new">
                <div className="sidebar-header-new">
                    <h3>Test Modules</h3>
                    <button
                        className="btn-icon-plain"
                        onClick={onOpenAddModule}
                        title="Add Module"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="modules-list-new">
                    {modules.map(module => (
                        <div key={module.id} className="module-item-new">
                            <div className="module-header-row">
                                <div className="module-info" onClick={() => toggleModule(module.id)}>
                                    {module.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    <span className="module-name">{module.name}</span>
                                    <span className="count-badge">({module.scenarios.length})</span>
                                </div>

                                <div className="module-actions action-menu-container">
                                    <button className="icon-action" onClick={(e) => { e.stopPropagation(); onOpenAddScenario(module) }}><Plus size={12} /></button>
                                    <button className="icon-action" onClick={(e) => toggleMenu(e, module.id, 'module')}><MoreVertical size={12} /></button>
                                    {activeMenu?.id === module.id && activeMenu?.type === 'module' && (
                                        <div className="action-dropdown-menu">
                                            <button onClick={(e) => { e.stopPropagation(); onEditModule(module); setActiveMenu(null) }}><Edit size={12} /> Edit</button>
                                            <button onClick={(e) => { e.stopPropagation(); onDeleteModule(module.id); setActiveMenu(null) }} className="danger"><Trash2 size={12} /> Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {module.expanded && (
                                <div className="scenarios-list-new">
                                    {module.scenarios.map(scenario => (
                                        <div key={scenario.id} className="scenario-item-new">
                                            <div className="scenario-header-row">
                                                <div className="scenario-info" onClick={() => toggleScenario(module.id, scenario.id)}>
                                                    {scenario.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                    <span className="scenario-name">{scenario.name}</span>
                                                    <span className="count-badge-sub">({scenario.testCases.length})</span>
                                                </div>
                                                <div className="scenario-actions action-menu-container">
                                                    <button className="icon-action" onClick={(e) => toggleMenu(e, scenario.id, 'scenario')}><MoreVertical size={12} /></button>
                                                    {activeMenu?.id === scenario.id && activeMenu?.type === 'scenario' && (
                                                        <div className="action-dropdown-menu">
                                                            <button onClick={(e) => { e.stopPropagation(); onEditScenario(module, scenario); setActiveMenu(null) }}><Edit size={12} /> Edit</button>
                                                            <button onClick={(e) => { e.stopPropagation(); onDeleteScenario(module.id, scenario.id); setActiveMenu(null) }} className="danger"><Trash2 size={12} /> Delete</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="test-cases-content-area">
                <div className="content-toolbar">
                    <div className="toolbar-left">
                        <h3>All Cases</h3>
                        <div className="search-input-wrapper">
                            <SearchIcon size={14} className="search-icon-overlay" />
                            <input type="text" placeholder="Search Test cases" className="search-input-dense" />
                        </div>
                    </div>
                    <div className="toolbar-right">
                        <button className="btn-toolbar"><Upload size={14} /> Import Test Case</button>
                        <button className="btn-toolbar"><RefreshCw size={14} /> Regenerate Test Case ID</button>
                    </div>
                </div>

                <div className="test-cases-scroll-area">
                    {modules.map(module => (
                        module.expanded && module.scenarios.map(scenario => (
                            scenario.expanded && (
                                <div key={`${module.id}-${scenario.id}`} className="test-group-block">
                                    <div className="group-header">
                                        <div className="group-title">
                                            <span className="path-module">{module.name}</span>
                                            <span className="path-separator">&gt;</span>
                                            <span className="path-scenario">{scenario.name}</span>
                                        </div>
                                        <button className="btn-add-dense" onClick={() => onOpenAddTestCase(module, scenario)}>
                                            <Plus size={12} /> Add Test Case
                                        </button>
                                    </div>

                                    <div className="group-list">
                                        {scenario.testCases.length === 0 ? (
                                            <div className="empty-row">No test cases in this scenario</div>
                                        ) : (
                                            scenario.testCases.map(tc => (
                                                <div key={tc.id} className="test-case-row">
                                                    <div className="tc-col-id">
                                                        <span className="status-dot"></span>
                                                        {tc.id}
                                                    </div>
                                                    <div className="tc-col-name">{tc.name}</div>
                                                    <div className="tc-col-actions">
                                                        <button className="action-btn" title="Edit" onClick={() => onEditTestCase(module, scenario, tc)}><Edit size={14} /></button>
                                                        <button className="action-btn" title="Duplicate" onClick={() => handleDuplicateTestCase(module, scenario, tc)}><Copy size={14} /></button>
                                                        <button className="action-btn danger" title="Delete" onClick={() => onDeleteTestCase(module.id, scenario.id, tc.id)}><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )
                        ))
                    ))}
                </div>

                {/* Footer Pagination Mock */}
                <div className="pagination-footer">
                    <span className="pagination-info">1-52 of 52</span>
                </div>
            </div>

            <style>{`
            .test-cases-layout {
                display: flex;
                height: 100%;
                gap: 0; 
                overflow: hidden;
            }
            
            /* New Sidebar Styles */
            .modules-sidebar-new {
                width: 300px;
                min-width: 300px;
                background: white;
                border-right: 1px solid #e2e8f0;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .sidebar-header-new {
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #f1f5f9;
            }
            .sidebar-header-new h3 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
                color: #334155;
            }
            .modules-list-new {
                flex: 1;
                overflow-y: auto;
                padding: 0.5rem;
            }
            .module-item-new { margin-bottom: 0px; }
            .module-header-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.5rem;
                border-radius: 4px;
                cursor: pointer;
            }
            .module-header-row:hover { background-color: #f8fafc; }
            .module-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 500;
                color: #334155;
                font-size: 0.9rem;
                flex: 1;
                overflow: hidden;
            }
            .count-badge { color: #94a3b8; font-size: 0.8rem; }
            .module-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s; position: relative; }
            .module-header-row:hover .module-actions { opacity: 1; }
            .icon-action {
                background: none;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #64748b;
            }
            .icon-action:hover { background: #f1f5f9; color: #0f172a; }

            .scenarios-list-new { padding-left: 20px; margin-top: 2px; }
            .scenario-item-new { margin: 2px 0; }
            .scenario-header-row {
                display: flex;
                justify-content: space-between;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.85rem;
                color: #475569;
            }
            .scenario-header-row:hover { background-color: #f8fafc; }
            .scenario-info { display: flex; align-items: center; gap: 6px; cursor: pointer; flex: 1; }
            .scenario-actions { opacity: 0; position: relative; }
            .scenario-header-row:hover .scenario-actions { opacity: 1; }

            /* Content Area */
            .test-cases-content-area {
                flex: 1;
                background: white;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                padding: 0 1.5rem; /* Add padding to sides */
            }
            .content-toolbar {
                padding: 1rem 0;
                border-bottom: 1px solid #f1f5f9;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }
            .toolbar-left {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .toolbar-left h3 { margin: 0; font-size: 1rem; color: #334155; min-width: max-content; }
            .toolbar-right { display: flex; gap: 0.5rem; align-items: center; }
            .btn-toolbar {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.4rem 0.75rem;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                font-size: 0.8rem;
                color: #475569;
                cursor: pointer;
                white-space: nowrap;
            }
            .btn-toolbar:hover { background: #f8fafc; color: #0f172a; border-color: #cbd5e1; }
            
            .search-input-wrapper { position: relative; display: flex; align-items: center; width: 100%; max-width: 300px; }
            .search-icon-overlay { position: absolute; left: 10px; color: #94a3b8; }
            .search-input-dense {
                padding: 0.5rem 0.5rem 0.5rem 2.2rem;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                font-size: 0.85rem;
                width: 250px;
                outline: none;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            .search-input-dense:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
            
            .test-cases-scroll-area {
                flex: 1;
                overflow-y: auto;
                padding: 1.5rem 0;
                background-color: white; /* Match content area bg */
            }
            .test-group-block {
                margin-bottom: 2rem;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px; /* Slightly more rounded */
                overflow: hidden;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* Subtle shadow */
            }
            .group-header {
                padding: 0.75rem 1rem;
                background: #f8fafc; /* Subtle background for header */
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .group-title { font-size: 0.9rem; font-weight: 500; color: #334155; display: flex; align-items: center; gap: 0.5rem; }
            .path-module { font-weight: 600; color: #0f172a; }
            .path-separator { color: #cbd5e1; }
            .path-scenario { color: #475569; }
            
            .btn-add-dense {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 10px;
                font-size: 0.75rem;
                background: white;
                border: 1px solid #cbd5e1;
                border-radius: 4px;
                cursor: pointer;
                color: #475569;
                font-weight: 500;
                transition: all 0.2s;
            }
            .btn-add-dense:hover { border-color: #64748b; color: #0f172a; background: #f1f5f9; }
            
            .group-list { }
            .test-case-row {
                display: flex;
                align-items: center;
                padding: 0.875rem 1rem; /* Increase padding */
                border-bottom: 1px solid #f1f5f9;
                transition: background 0.15s;
            }
            .test-case-row:last-child { border-bottom: none; }
            .test-case-row:hover { background-color: #f8fafc; }
            
            .tc-col-id {
                width: 140px; /* Wider ID col */
                display: flex;
                align-items: center;
                gap: 10px;
                color: #64748b;
                font-size: 0.85rem;
                font-family: monospace; /* Monospace for ID */
            }
            .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #fbbf24; /* Default yellow/pending */ }
            
            .tc-col-name { flex: 1; font-size: 0.9rem; color: #334155; font-weight: 500; }
            .tc-col-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s; }
            .test-case-row:hover .tc-col-actions { opacity: 1; }
            
            .action-btn {
                background: none;
                border: 1px solid transparent;
                border-radius: 4px;
                color: #94a3b8;
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .action-btn:hover { color: #3b82f6; background-color: #eff6ff; }
            .action-btn.danger:hover { color: #ef4444; background-color: #fef2f2; }
            
            .pagination-footer {
                padding: 1rem 0;
                border-top: 1px solid #e2e8f0;
                text-align: right;
                font-size: 0.8rem;
                color: #64748b;
            }
            .empty-row { padding: 1rem; color: #94a3b8; font-style: italic; text-align: center; font-size: 0.85rem; }
            `}</style>
        </div>
    )
}

function SearchIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}


export default TestCasesList
