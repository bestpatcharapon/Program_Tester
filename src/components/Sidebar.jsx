import { NavLink } from 'react-router-dom'
import {
    TestTube,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react'
import logo from '../assets/logo.png'
import './Sidebar.css'

const Sidebar = ({ isCollapsed, toggleSidebar }) => {

    const navItems = [
        { path: '/', icon: FileText, label: 'All Projects' },
        { path: '/settings', icon: Settings, label: 'Settings' }
    ]

    return (
        <aside className={`sidebar glass-strong ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-header">
                <div className={`logo ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="logo-icon">
                        <img src={logo} alt="Besttest Logo" style={{ width: '40px', height: '40px' }} />
                    </div>
                    {!isCollapsed && (
                        <div className="logo-text">
                            <h1 className="gradient-text">Besttest</h1>
                        </div>
                    )}
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
                        title={isCollapsed ? item.label : ''}
                    >
                        <item.icon size={20} />
                        {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Toggle Button */}
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

        </aside>
    )
}

export default Sidebar
