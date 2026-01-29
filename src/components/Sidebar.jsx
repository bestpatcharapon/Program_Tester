import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Play,
    FileSpreadsheet,
    Image,
    Settings,
    Zap,
    Server,
    TestTube
} from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ environment, onEnvironmentChange }) => {
    const environments = [
        { id: 'dev', name: 'Development', color: '#10b981' },
        { id: 'uat', name: 'UAT', color: '#f59e0b' },
        { id: 'prod', name: 'Production', color: '#ef4444' }
    ]

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/runner', icon: Play, label: 'Test Runner' },
        { path: '/testcases', icon: FileSpreadsheet, label: 'Test Cases (Import)' },
        { path: '/testcases-new', icon: TestTube, label: 'Test Cases (New)' },
        { path: '/gallery', icon: Image, label: 'Evidence Gallery' },
        { path: '/settings', icon: Settings, label: 'Settings' }
    ]

    return (
        <aside className="sidebar glass-strong">
            {/* Logo */}
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">
                        <Zap size={28} strokeWidth={2.5} />
                    </div>
                    <div className="logo-text">
                        <h1 className="gradient-text">AutoTest</h1>
                        <p>Center</p>
                    </div>
                </div>
            </div>

            {/* Environment Switcher */}
            <div className="env-switcher">
                <div className="env-label">
                    <Server size={16} />
                    <span>Environment</span>
                </div>
                <div className="env-buttons">
                    {environments.map(env => (
                        <button
                            key={env.id}
                            className={`env-btn ${environment === env.id ? 'active' : ''}`}
                            onClick={() => onEnvironmentChange(env.id)}
                            style={{
                                '--env-color': env.color
                            }}
                        >
                            <span className="env-indicator"></span>
                            {env.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        end={item.path === '/'}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Framework Support Badge */}
            <div className="sidebar-footer">
                <div className="framework-badge">
                    <TestTube size={16} />
                    <div className="framework-text">
                        <div className="framework-label">Supports</div>
                        <div className="framework-list">Robot • Playwright • Pytest</div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
