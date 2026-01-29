import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import '../../pages/TestCasesNew.css'

const TestCaseModal = ({ isOpen, onClose, onSave, initialData, mode = 'create' }) => {
    const defaultState = {
        id: '',
        name: '',
        priority: 'Medium',
        type: 'UI',
        steps: '',
        expectedResult: '',
        reference: ''
    }

    const [formData, setFormData] = useState(defaultState)

    // Reset or Load data when modal opens/changes
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    id: initialData.id,
                    name: initialData.name,
                    priority: initialData.priority,
                    type: initialData.type,
                    steps: initialData.steps,
                    expectedResult: initialData.expectedResult,
                    reference: initialData.reference || ''
                })
            } else {
                setFormData({
                    ...defaultState,
                    id: mode === 'create' ? `TC_${Date.now()}` : '' // Auto ID for new
                })
            }
        }
    }, [isOpen, initialData, mode])

    if (!isOpen) return null

    const handleSave = () => {
        onSave(formData)
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header" style={{ padding: '0 0 1.5rem 0', border: 'none' }}>
                    <h2>{mode === 'edit' ? 'Edit Test Case' : 'New Test Case'}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Case ID</label>
                        <input
                            type="text"
                            placeholder="TC-55"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Case Name</label>
                        <input
                            type="text"
                            placeholder="Input test case name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="UI">UI</option>
                            <option value="e2e">e2e</option>
                            <option value="Function">Function</option>
                            <option value="API">API</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Steps</label>
                        <textarea
                            placeholder="Instruction"
                            rows="4"
                            value={formData.steps}
                            onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Expected Results</label>
                        <textarea
                            placeholder="Expected"
                            rows="4"
                            value={formData.expectedResult}
                            onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Reference</label>
                    <input
                        type="text"
                        placeholder="Input reference"
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    />
                </div>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TestCaseModal
