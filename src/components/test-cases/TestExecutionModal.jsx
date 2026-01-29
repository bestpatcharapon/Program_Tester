import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, FileText } from 'lucide-react'
import '../../pages/TestResults.css' // We will update this CSS file

const TestExecutionModal = ({
    isOpen,
    onClose,
    testCase,
    currentIndex,
    totalCases,
    onPrev,
    onNext,
    onUpdateResult,
    onSaveAndClose
}) => {

    const [result, setResult] = useState(testCase?.result || null)
    const [comments, setComments] = useState(testCase?.comments || '')

    // Sync state when testCase changes (navigation)
    useEffect(() => {
        if (testCase) {
            setResult(testCase.result)
            setComments(testCase.comments || '')
        }
    }, [testCase])

    if (!isOpen || !testCase) return null

    const handleResultClick = (status) => {
        setResult(status)
        onUpdateResult(testCase.id, status, comments)
    }

    const handleCommentChange = (e) => {
        const newComments = e.target.value
        setComments(newComments)
        // Auto-save comments on change or wait for explicit action? 
        // Usually good to save on blur or debounce, but for simplicity saving on navigation or explicit 'finish' is safer.
        // For now, let's update parent immediately to keep sync simple
        onUpdateResult(testCase.id, result, newComments)
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-execution" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-execution-header">
                    <h3>
                        [{currentIndex + 1}/{totalCases}] {testCase.id}: {testCase.name}
                    </h3>
                    <div className="header-controls">
                        <button className="nav-btn" onClick={onPrev} disabled={currentIndex === 0}>
                            {'< Prev'}
                        </button>
                        <button className="nav-btn" onClick={onNext} disabled={currentIndex === totalCases - 1}>
                            {'Next >'}
                        </button>
                    </div>
                </div>

                {/* Sub Header Info */}
                <div className="modal-execution-sub">
                    <div className="ref-link">
                        <span>Reference : </span>
                        {testCase.reference ? (
                            <a href={testCase.reference} target="_blank" rel="noopener noreferrer">{testCase.reference}</a>
                        ) : '-'}
                    </div>
                    <div className="memo-link">
                        <span>Memo : See memo</span>
                    </div>
                </div>

                {/* Meta Fields Row */}
                <div className="execution-meta-row">
                    <div className="meta-field">
                        <label>Test Module</label>
                        <div className="field-value">{testCase.module}</div>
                    </div>
                    <div className="meta-field">
                        <label>Test Scenario</label>
                        <div className="field-value">{testCase.scenario}</div>
                    </div>
                    <div className="meta-field">
                        <label>Test Result</label>
                        <div className="status-buttons">
                            <button
                                className={`status-btn passed ${result === 'Passed' ? 'active' : ''}`}
                                onClick={() => handleResultClick('Passed')}
                            >
                                Passed
                            </button>
                            <button
                                className={`status-btn failed ${result === 'Failed' ? 'active' : ''}`}
                                onClick={() => handleResultClick('Failed')}
                            >
                                Failed
                            </button>
                            <button
                                className={`status-btn skipped ${result === 'Skipped' ? 'active' : ''}`}
                                onClick={() => handleResultClick('Skipped')}
                            >
                                Skipped
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content 3-Columns */}
                <div className="execution-content-grid">
                    <div className="content-col">
                        <label>Steps</label>
                        <div className="content-box read-only">
                            {testCase.steps}
                        </div>
                    </div>
                    <div className="content-col">
                        <label>Expected Result</label>
                        <div className="content-box read-only">
                            {testCase.expectedResult}
                        </div>
                    </div>
                    <div className="content-col">
                        <label>Comments</label>
                        <div className="rich-editor-mock">
                            <div className="toolbar">
                                <span>B</span>
                                <span>I</span>
                                <span>U</span>
                                <span className="divider">|</span>
                                <ImageIcon size={14} />
                            </div>
                            <textarea
                                value={comments}
                                onChange={handleCommentChange}
                                placeholder="Add comments..."
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-execution-footer">
                    <button className="btn-logs">
                        See logs
                    </button>
                    <div className="footer-right">
                        <button className="btn-next" onClick={onNext}>
                            Save next
                        </button>
                        <button className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestExecutionModal
