import React, { useState, useEffect } from 'react'
import '../../pages/TestCasesNew.css'

const SimpleInputModal = ({ isOpen, onClose, onSave, title, label, placeholder, initialValue = '' }) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue || '')
        }
    }, [isOpen, initialValue])

    if (!isOpen) return null

    const handleSave = () => {
        if (value.trim()) {
            onSave(value)
            setValue('')
            onClose()
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{title}</h2>
                <div className="form-group">
                    <label>{label}</label>
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
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

export default SimpleInputModal
