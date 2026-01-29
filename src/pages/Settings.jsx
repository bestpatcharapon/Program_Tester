import React, { useState } from 'react'
import './Settings.css'

const Settings = () => {
    return (
        <div className="settings-page">
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your application preferences</p>
            </div>

            <div className="settings-content">
                <div className="settings-section">
                    <h2>General</h2>
                    <div className="setting-item">
                        <label>Application Version</label>
                        <div className="setting-value">1.0.0</div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Data Management</h2>
                    <div className="setting-item">
                        <label>Reset Application Data</label>
                        <button
                            className="btn-danger"
                            onClick={() => {
                                if (confirm("Are you sure? This will delete all projects and test cases!")) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                        >
                            Clear All Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
