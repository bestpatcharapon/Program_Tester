import { NavLink } from 'react-router-dom'
import {
    Zap,
    TestTube,
    FileText,
    Settings
} from 'lucide-react'
import './Sidebar.css'

const Sidebar = () => {

    const navItems = [
        { path: '/', icon: FileText, label: 'All Projects' },
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

        </aside>
    )
}

export default Sidebar
