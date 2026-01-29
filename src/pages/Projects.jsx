import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Folder, Clock, MoreVertical, Trash2 } from 'lucide-react'
import './Projects.css'
import SimpleInputModal from '../components/test-cases/SimpleInputModal'

const Projects = () => {
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)

    // Load projects on mount
    useEffect(() => {
        const savedProjects = localStorage.getItem('banana_projects')
        if (savedProjects) {
            setProjects(JSON.parse(savedProjects))
        } else {
            // Initial dummy data if empty
            const initialProjects = [
                { id: 'p1', name: 'Banana AI Assistant', status: 'Active', caseCount: 0, lastTested: '-' },
            ]
            setProjects(initialProjects)
            localStorage.setItem('banana_projects', JSON.stringify(initialProjects))
        }
    }, [])

    const handleCreateProject = (name) => {
        const newProject = {
            id: `p_${Date.now()}`,
            name: name,
            status: 'Active',
            caseCount: 0,
            lastTested: '-',
            createdAt: new Date().toISOString()
        }
        const updatedProjects = [...projects, newProject]
        setProjects(updatedProjects)
        localStorage.setItem('banana_projects', JSON.stringify(updatedProjects))
    }

    const handleDeleteProject = (e, projectId) => {
        e.stopPropagation() // Prevent navigation
        if (confirm('Are you sure you want to delete this project?')) {
            const updatedProjects = projects.filter(p => p.id !== projectId)
            setProjects(updatedProjects)
            localStorage.setItem('banana_projects', JSON.stringify(updatedProjects))

            // Optional: clean up project specific data from local storage
            // localStorage.removeItem(`project_${projectId}_modules`)
            // etc.
        }
    }

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="projects-page">
            <div className="projects-header">
                <h1>Projects</h1>
                <div className="projects-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search Project name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={18} /> New Project
                    </button>
                </div>
            </div>

            <div className="projects-grid">
                {filteredProjects.map(project => (
                    <div
                        key={project.id}
                        className="project-card"
                        onClick={() => navigate(`/project/${project.id}`)}
                    >
                        <div className="project-card-header">
                            <div className="project-icon">
                                <Folder size={20} className="text-blue" />
                                <h3>{project.name}</h3>
                            </div>
                            <button className="btn-icon" onClick={(e) => handleDeleteProject(e, project.id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="project-status">
                            Status: <span className="status-active">{project.status}</span>
                        </div>
                        <div className="project-stats">
                            <p>Test cases: <strong>{project.caseCount} cases</strong></p>
                            <p className="last-tested">Latest Tested: {project.lastTested}</p>
                        </div>
                    </div>
                ))}

                {filteredProjects.length === 0 && (
                    <div className="no-projects">
                        <p>No projects found. Create one to get started!</p>
                    </div>
                )}
            </div>

            <SimpleInputModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSave={handleCreateProject}
                title="Create New Project"
                label="Project Name"
                placeholder="e.g., Solar System App"
            />
        </div>
    )
}

export default Projects
