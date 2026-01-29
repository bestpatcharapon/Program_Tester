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
                        className="btn-action-filled"
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
                                    <span className="module-name title-text" title={module.name}>{module.name}</span>
                                    <span className="count-badge">({module.scenarios.length})</span>
                                </div>

                                <div className="module-actions action-menu-container">
                                    <button className="btn-action-filled" onClick={(e) => { e.stopPropagation(); onOpenAddScenario(module) }}><Plus size={12} /></button>
                                    <button className="btn-action-ghost" onClick={(e) => toggleMenu(e, module.id, 'module')}><MoreVertical size={12} /></button>
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
                                                    <button className="btn-action-ghost" onClick={(e) => toggleMenu(e, scenario.id, 'scenario')}><MoreVertical size={12} /></button>
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
                <div className="content-header-container">
                    {/* Row 1: Title & Top Actions */}
                    <div className="header-top-row">
                        <h2 className="header-title">การเข้าสู่ระบบ&ออกจากระบบ</h2>
                        <div className="header-actions">
                            <div className="search-input-wrapper">
                                <SearchIcon size={16} className="search-icon-overlay" />
                                <input
                                    type="text"
                                    placeholder="Search Test cases"
                                    className="search-input-dense"
                                />
                            </div>
                            <button className="btn-outline">
                                <Upload size={14} /> Import Test Case
                            </button>
                            <button className="btn-outline">
                                <RefreshCw size={14} /> Regenerate Test Case ID
                            </button>
                        </div>
                    </div>

                    {/* Row 2: Breadcrumbs & Add Button */}
                    <div className="header-bottom-row">
                        <div className="breadcrumbs">
                            <span className="crumb-text">การเข้าสู่ระบบ&ออกจากระบบ</span>
                            <ChevronRight size={14} className="crumb-separator" />
                            <span className="crumb-text bold">ผู้ใช้เข้าสู่ระบบ</span>
                        </div>
                        <button className="btn-outline btn-add">
                            <Plus size={14} /> Add Test Case
                        </button>
                    </div>
                </div>

                <div className="test-cases-scroll-area">
                    {modules.map(module => (
                        module.expanded && module.scenarios.map(scenario => (
                            scenario.expanded && (
                                <div key={`${module.id}-${scenario.id}`} className="test-group-block">
                                    {/* Removed group header as per new design where context is in breadcrumbs, 
                                        OR keep it if they want per-group lists. 
                                        The image shows a flat list style or single group view. 
                                        I will keep the list simple for now but remove the per-group header buttons since 'Add' is now global top right. */}

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
                width: 100%;
                gap: 1.5rem;
                overflow: hidden;
                background-color: #f8fafc; 
                padding: 1rem;
            }
            
            /* Sidebar - keep existing styles or assume they render correctly from previous steps if not overwritten here. 
               Since I am replacing the whole style block, I must include sidebar styles again or they will be lost if I replace the whole block.
               I will include the styles I just wrote in previous steps. */

            .modules-sidebar-new {
                width: 340px; 
                min-width: 340px;
                background: white;
                border: 1px solid #e2e8f0; 
                border-radius: 8px; 
                display: flex;
                flex-direction: column;
                overflow: hidden;
                padding: 1.5rem;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            .sidebar-header-new {
                padding-bottom: 1rem;
                margin-bottom: 0.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
             .sidebar-header-new h3 { margin: 0; font-size: 1.1rem; font-weight: 700; color: #0f172a; }

            .btn-icon-plain {
                background: #0f172a;
                border: none;
                border-radius: 4px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                transition: all 0.2s;
            }
            .btn-icon-plain:hover { background: #334155; transform: translateY(-1px); }

            .modules-list-new {
                flex: 1;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                padding-top: 0.5rem;
            }
            .module-item-new { 
                margin-bottom: 0;
                border-bottom: 1px solid #e2e8f0; /* Visible grey separator */
                padding: 0.75rem 0; 
            }
            .module-item-new:last-child { border-bottom: none; }
            
            .module-header-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.5rem; 
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.15s;
                gap: 0.75rem; 
            }
            .module-header-row:hover { background-color: #f8fafc; }
            
            .module-info {
                display: flex;
                align-items: center;
                justify-content: flex-start; 
                gap: 4px; 
                font-weight: 500;
                color: #334155;
                font-size: 0.95rem; 
                flex: 1;
                overflow: hidden; 
                min-width: 0; 
            }
            .module-info > svg { margin-right: 8px; flex-shrink: 0; }

            .title-text { 
                overflow: hidden; 
                text-overflow: ellipsis; 
                white-space: nowrap; 
                flex: 0 1 auto; 
                margin-right: 0;
            }
            .count-badge { color: #94a3b8; font-size: 0.8rem; font-weight: 400; background: transparent; padding: 0; flex-shrink: 0; }
            
            .module-actions { 
                display: flex; 
                gap: 6px; 
                align-items: center;
                opacity: 1; 
                position: relative; 
                flex-shrink: 0; 
            }
            
            .btn-action-filled {
                background: #0f172a;
                border: none;
                border-radius: 4px;
                width: 24px; 
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                transition: all 0.2s;
            }
            .btn-action-filled:hover { background: #334155; transform: translateY(-1px); }

            .btn-action-ghost {
                background: transparent;
                border: none;
                border-radius: 4px;
                width: 24px; 
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #64748b; /* Dark Gray */
                transition: all 0.2s;
            }
            .btn-action-ghost:hover { background: #f1f5f9; color: #0f172a; }

            .scenarios-list-new { 
                padding-left: 0; 
                margin-top: 0.25rem; 
                display: flex;
                flex-direction: column;
                gap: 0;
                border-left: 2px solid #e2e8f0;
                margin-left: 1.25rem; 
            }
            .scenario-item-new { 
                border-bottom: 1px solid #f1f5f9; /* Lighter grey separator for nested items */
            }
            .scenario-item-new:last-child { border-bottom: none; }

            .scenario-header-row {
                display: flex;
                justify-content: space-between;
                padding: 0.4rem 0.75rem; 
                border-radius: 4px;
                font-size: 0.9rem;
                color: #475569;
                align-items: center;
                gap: 0.75rem; 
            }
            .scenario-header-row:hover { background-color: #f8fafc; color: #0f172a; }
            .scenario-info { 
                display: flex; 
                align-items: center; 
                justify-content: flex-start; /* Align items to start */
                gap: 4px; 
                cursor: pointer; 
                flex: 1; 
                min-width: 0; 
                overflow: hidden;
            }
            .scenario-info > svg { margin-right: 8px; flex-shrink: 0; }

            .scenario-name {
                overflow: hidden; 
                text-overflow: ellipsis; 
                white-space: nowrap;
                flex: 0 1 auto; /* Do not grow, allow shrink */
                margin-right: 0;
            }
            .count-badge-sub { font-size: 0.8rem; color: #94a3b8; flex-shrink: 0; }
            .scenario-actions { display: flex; gap: 8px; opacity: 1; align-items: center; flex-shrink: 0; }

            /* Content Area Styles */
            .test-cases-content-area {
                flex: 1;
                background: white;
                border: 1px solid #e2e8f0; 
                border-radius: 8px; 
                display: flex;
                flex-direction: column;
                overflow: hidden;
                padding: 0 1.5rem; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }

            .content-header-container {
                padding: 1.5rem 0 0 0; /* Remove bottom padding, handle in rows */
                display: flex;
                flex-direction: column;
                gap: 0; /* Remove gap, handle with padding */
            }

            .header-top-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #e2e8f0; /* Separator under title/search */
            }
            .header-title {
                font-size: 1.25rem; /* Slightly larger */
                font-weight: 700;
                color: #0f172a;
                margin: 0;
            }
            .header-actions {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .header-bottom-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 0; /* Padding for the second row */
            }
            .breadcrumbs {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.95rem;
                color: #64748b;
            }
            .crumb-separator { opacity: 0.5; }
            .crumb-text.bold { color: #0f172a; font-weight: 600; }

            .btn-outline {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0 1rem;
                height: 38px; /* Fixed height for alignment */
                background: white;
                border: 1px solid #cbd5e1; 
                border-radius: 6px;
                font-size: 0.85rem;
                font-weight: 500;
                color: #334155;
                cursor: pointer;
                transition: all 0.2s;
            }
            .btn-outline:hover {
                border-color: #94a3b8;
                background: #f8fafc;
                color: #0f172a;
            }

            .search-input-wrapper { position: relative; width: 250px; }
            .search-icon-overlay { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
            .search-input-dense {
                width: 100%;
                height: 38px; /* Match button height */
                padding: 0 1rem 0 3rem; /* Center text vertically with height */
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                font-size: 0.85rem;
                outline: none;
            }
            .search-input-dense:focus { border-color: #3b82f6; }

            .test-cases-scroll-area {
                flex: 1;
                overflow-y: auto;
                padding: 1rem 0;
            }
            .test-group-block { margin-bottom: 0; border: none; box-shadow: none; } /* Flat list look */
            
            .test-case-row {
                display: flex;
                align-items: center;
                padding: 1rem 0; /* More spacing */
                border-bottom: 1px solid #f1f5f9;
                transition: background 0.15s;
                gap: 1rem; /* Ensure gap between flex items */
            }
            .test-case-row:hover { background-color: #f8fafc; }
            
            .tc-col-id {
                width: 180px; /* Much wider for long IDs */
                min-width: 180px;
                display: flex;
                align-items: center;
                gap: 8px;
                color: #64748b;
                font-family: monospace;
            }
            .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #fbbf24; }
            
            .tc-col-name { flex: 1; font-size: 0.95rem; color: #334155; font-weight: 500; }
            .tc-col-actions { display: flex; gap: 4px; opacity: 1; } /* Actions always visible in this view? or hover? Image shows visible icons maybe */
            
            .action-btn {
                background: none;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                padding: 4px;
            }
            .action-btn:hover { color: #3b82f6; }
            
            .pagination-footer {
                padding: 1rem 0;
                border-top: 1px solid #f1f5f9;
                text-align: right;
                font-size: 0.8rem;
                color: #64748b;
            }
            .empty-row { padding: 2rem; color: #94a3b8; text-align: center; }
            `}</style>
        </div>
    )
}

function SearchIcon({ size = 24, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}

export default TestCasesList
