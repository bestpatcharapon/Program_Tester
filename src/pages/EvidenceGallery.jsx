import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Image as ImageIcon,
    Calendar,
    Filter,
    Download,
    Trash2,
    ZoomIn,
    X,
    FolderOpen,
    Clock
} from 'lucide-react'
import { format } from 'date-fns'
import './EvidenceGallery.css'

const EvidenceGallery = () => {
    const [selectedImage, setSelectedImage] = useState(null)
    const [filterType, setFilterType] = useState('all')

    // Mock evidence data
    const evidenceData = [
        {
            id: 1,
            filename: 'login_failure_20260127_095523.png',
            testName: 'Login Test',
            framework: 'robot',
            timestamp: new Date('2026-01-27T09:55:23'),
            type: 'failure',
            size: '245 KB'
        },
        {
            id: 2,
            filename: 'dashboard_error_20260127_100142.png',
            testName: 'Dashboard Load Test',
            framework: 'playwright',
            timestamp: new Date('2026-01-27T10:01:42'),
            type: 'failure',
            size: '312 KB'
        },
        {
            id: 3,
            filename: 'form_validation_20260127_101523.png',
            testName: 'Form Submission Test',
            framework: 'playwright',
            timestamp: new Date('2026-01-27T10:15:23'),
            type: 'failure',
            size: '198 KB'
        },
        {
            id: 4,
            filename: 'api_timeout_20260127_102034.png',
            testName: 'API Integration Test',
            framework: 'pytest',
            timestamp: new Date('2026-01-27T10:20:34'),
            type: 'failure',
            size: '156 KB'
        },
        {
            id: 5,
            filename: 'logout_error_20260127_103145.png',
            testName: 'Logout Test',
            framework: 'robot',
            timestamp: new Date('2026-01-27T10:31:45'),
            type: 'failure',
            size: '223 KB'
        },
        {
            id: 6,
            filename: 'navigation_fail_20260126_143521.png',
            testName: 'Navigation Test',
            framework: 'playwright',
            timestamp: new Date('2026-01-26T14:35:21'),
            type: 'failure',
            size: '287 KB'
        },
    ]

    const frameworkColors = {
        robot: '#3b82f6',
        playwright: '#10b981',
        pytest: '#a855f7'
    }

    const frameworkIcons = {
        robot: '🤖',
        playwright: '🎭',
        pytest: '🐍'
    }

    const filteredEvidence = filterType === 'all'
        ? evidenceData
        : evidenceData.filter(e => e.framework === filterType)

    const groupedByDate = filteredEvidence.reduce((groups, evidence) => {
        const date = format(evidence.timestamp, 'yyyy-MM-dd')
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(evidence)
        return groups
    }, {})

    return (
        <div className="evidence-gallery">
            {/* Header */}
            <div className="gallery-header">
                <div>
                    <h1>Evidence Gallery</h1>
                    <p>Auto-captured screenshots from failed tests</p>
                </div>
                <div className="gallery-stats">
                    <div className="stat-badge">
                        <ImageIcon size={16} />
                        <span>{evidenceData.length} Screenshots</span>
                    </div>
                    <div className="stat-badge">
                        <FolderOpen size={16} />
                        <span>{Object.keys(groupedByDate).length} Days</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="gallery-filters glass">
                <div className="filter-label">
                    <Filter size={18} />
                    <span>Filter by Framework</span>
                </div>
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        All ({evidenceData.length})
                    </button>
                    <button
                        className={`filter-btn ${filterType === 'robot' ? 'active' : ''}`}
                        onClick={() => setFilterType('robot')}
                        style={{ '--filter-color': frameworkColors.robot }}
                    >
                        {frameworkIcons.robot} Robot ({evidenceData.filter(e => e.framework === 'robot').length})
                    </button>
                    <button
                        className={`filter-btn ${filterType === 'playwright' ? 'active' : ''}`}
                        onClick={() => setFilterType('playwright')}
                        style={{ '--filter-color': frameworkColors.playwright }}
                    >
                        {frameworkIcons.playwright} Playwright ({evidenceData.filter(e => e.framework === 'playwright').length})
                    </button>
                    <button
                        className={`filter-btn ${filterType === 'pytest' ? 'active' : ''}`}
                        onClick={() => setFilterType('pytest')}
                        style={{ '--filter-color': frameworkColors.pytest }}
                    >
                        {frameworkIcons.pytest} Pytest ({evidenceData.filter(e => e.framework === 'pytest').length})
                    </button>
                </div>
            </div>

            {/* Gallery Grid - Grouped by Date */}
            <div className="gallery-content">
                {Object.entries(groupedByDate).map(([date, items]) => (
                    <div key={date} className="date-group">
                        <div className="date-header">
                            <Calendar size={18} />
                            <h3>{format(new Date(date), 'EEEE, MMMM d, yyyy')}</h3>
                            <span className="date-count">{items.length} screenshots</span>
                        </div>

                        <div className="evidence-grid">
                            {items.map((evidence, index) => (
                                <motion.div
                                    key={evidence.id}
                                    className="evidence-card glass"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    onClick={() => setSelectedImage(evidence)}
                                >
                                    <div
                                        className="evidence-thumbnail"
                                        style={{
                                            background: `linear-gradient(135deg, ${frameworkColors[evidence.framework]}20 0%, ${frameworkColors[evidence.framework]}10 100%)`
                                        }}
                                    >
                                        <div className="thumbnail-placeholder">
                                            <ImageIcon size={48} />
                                            <span className="framework-badge" style={{ background: frameworkColors[evidence.framework] }}>
                                                {frameworkIcons[evidence.framework]}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="evidence-info">
                                        <h4>{evidence.testName}</h4>
                                        <div className="evidence-meta">
                                            <span className="meta-item">
                                                <Clock size={12} />
                                                {format(evidence.timestamp, 'HH:mm:ss')}
                                            </span>
                                            <span className="meta-item">
                                                {evidence.size}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="evidence-actions">
                                        <button className="action-btn" onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedImage(evidence)
                                        }}>
                                            <ZoomIn size={16} />
                                        </button>
                                        <button className="action-btn" onClick={(e) => e.stopPropagation()}>
                                            <Download size={16} />
                                        </button>
                                        <button className="action-btn danger" onClick={(e) => e.stopPropagation()}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="image-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            className="modal-content glass-strong"
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <div>
                                    <h3>{selectedImage.testName}</h3>
                                    <p>{selectedImage.filename}</p>
                                </div>
                                <button className="modal-close" onClick={() => setSelectedImage(null)}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="modal-image">
                                <div
                                    className="image-placeholder"
                                    style={{
                                        background: `linear-gradient(135deg, ${frameworkColors[selectedImage.framework]}30 0%, ${frameworkColors[selectedImage.framework]}10 100%)`
                                    }}
                                >
                                    <ImageIcon size={120} />
                                    <p>Screenshot Preview</p>
                                    <span className="framework-icon" style={{ background: frameworkColors[selectedImage.framework] }}>
                                        {frameworkIcons[selectedImage.framework]}
                                    </span>
                                </div>
                            </div>

                            <div className="modal-details">
                                <div className="detail-item">
                                    <span className="detail-label">Framework</span>
                                    <span className="detail-value" style={{ color: frameworkColors[selectedImage.framework] }}>
                                        {frameworkIcons[selectedImage.framework]} {selectedImage.framework}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Timestamp</span>
                                    <span className="detail-value">
                                        {format(selectedImage.timestamp, 'PPpp')}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">File Size</span>
                                    <span className="detail-value">{selectedImage.size}</span>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="btn btn-outline">
                                    <Download size={18} />
                                    Download
                                </button>
                                <button className="btn btn-outline danger">
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default EvidenceGallery
