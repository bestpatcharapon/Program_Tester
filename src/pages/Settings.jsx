import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Settings as SettingsIcon,
    Server,
    Save,
    RotateCw,
    CheckCircle2,
    Folder,
    Globe,
    Key
} from 'lucide-react'
import './Settings.css'

const Settings = ({ environment, onEnvironmentChange }) => {
    const [config, setConfig] = useState({
        dev: {
            url: 'https://dev.example.com',
            apiKey: 'dev_api_key_12345'
        },
        uat: {
            url: 'https://uat.example.com',
            apiKey: 'uat_api_key_67890'
        },
        prod: {
            url: 'https://prod.example.com',
            apiKey: 'prod_api_key_abcde'
        },
        evidencePath: './evidence',
        autoCapture: true,
        retryFailed: 3,
        timeout: 30
    })

    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        localStorage.setItem('autotest-config', JSON.stringify(config))
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    const handleReset = () => {
        const defaultConfig = {
            dev: { url: 'https://dev.example.com', apiKey: 'dev_api_key_12345' },
            uat: { url: 'https://uat.example.com', apiKey: 'uat_api_key_67890' },
            prod: { url: 'https://prod.example.com', apiKey: 'prod_api_key_abcde' },
            evidencePath: './evidence',
            autoCapture: true,
            retryFailed: 3,
            timeout: 30
        }
        setConfig(defaultConfig)
    }

    const updateEnvConfig = (env, field, value) => {
        setConfig(prev => ({
            ...prev,
            [env]: {
                ...prev[env],
                [field]: value
            }
        }))
    }

    const updateGeneralConfig = (field, value) => {
        setConfig(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <div className="settings">
            {/* Header */}
            <div className="settings-header">
                <div>
                    <h1>Settings</h1>
                    <p>Configure environments and test execution parameters</p>
                </div>
                <div className="settings-actions">
                    <button className="btn btn-outline" onClick={handleReset}>
                        <RotateCw size={18} />
                        Reset
                    </button>
                    <button className="btn btn-success" onClick={handleSave}>
                        {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                        {saved ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Environment Configuration */}
            <div className="settings-section">
                <div className="section-header">
                    <Server size={24} />
                    <div>
                        <h2>Environment Configuration</h2>
                        <p>Configure URLs and API keys for each environment</p>
                    </div>
                </div>

                <div className="env-configs">
                    {['dev', 'uat', 'prod'].map((env) => (
                        <motion.div
                            key={env}
                            className="env-config-card glass"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: env === 'dev' ? 0 : env === 'uat' ? 0.1 : 0.2 }}
                        >
                            <div className="env-config-header">
                                <h3>{env.toUpperCase()}</h3>
                                <button
                                    className={`env-status-btn ${environment === env ? 'active' : ''}`}
                                    onClick={() => onEnvironmentChange(env)}
                                >
                                    {environment === env ? 'Active' : 'Set Active'}
                                </button>
                            </div>

                            <div className="form-group">
                                <label>
                                    <Globe size={16} />
                                    Base URL
                                </label>
                                <input
                                    type="text"
                                    value={config[env].url}
                                    onChange={(e) => updateEnvConfig(env, 'url', e.target.value)}
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <Key size={16} />
                                    API Key
                                </label>
                                <input
                                    type="password"
                                    value={config[env].apiKey}
                                    onChange={(e) => updateEnvConfig(env, 'apiKey', e.target.value)}
                                    placeholder="Enter API key"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* General Settings */}
            <div className="settings-section">
                <div className="section-header">
                    <SettingsIcon size={24} />
                    <div>
                        <h2>General Settings</h2>
                        <p>Configure test execution and evidence capture</p>
                    </div>
                </div>

                <div className="general-settings glass">
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                <Folder size={16} />
                                Evidence Path
                            </label>
                            <input
                                type="text"
                                value={config.evidencePath}
                                onChange={(e) => updateGeneralConfig('evidencePath', e.target.value)}
                                placeholder="./evidence"
                            />
                            <span className="form-hint">Directory where screenshots will be saved</span>
                        </div>

                        <div className="form-group">
                            <label>Timeout (seconds)</label>
                            <input
                                type="number"
                                value={config.timeout}
                                onChange={(e) => updateGeneralConfig('timeout', parseInt(e.target.value))}
                                min="5"
                                max="300"
                            />
                            <span className="form-hint">Maximum time to wait for test completion</span>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Retry Failed Tests</label>
                            <input
                                type="number"
                                value={config.retryFailed}
                                onChange={(e) => updateGeneralConfig('retryFailed', parseInt(e.target.value))}
                                min="0"
                                max="10"
                            />
                            <span className="form-hint">Number of times to retry failed tests</span>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={config.autoCapture}
                                    onChange={(e) => updateGeneralConfig('autoCapture', e.target.checked)}
                                />
                                <span>Auto-capture screenshots on failure</span>
                            </label>
                            <span className="form-hint">Automatically save screenshots when tests fail</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Framework Paths */}
            <div className="settings-section">
                <div className="section-header">
                    <Folder size={24} />
                    <div>
                        <h2>Framework Paths</h2>
                        <p>Configure paths to test frameworks</p>
                    </div>
                </div>

                <div className="framework-paths glass">
                    <div className="form-group">
                        <label>🤖 Robot Framework</label>
                        <input
                            type="text"
                            defaultValue="./tests/robot"
                            placeholder="Path to Robot Framework tests"
                        />
                    </div>

                    <div className="form-group">
                        <label>🎭 Playwright</label>
                        <input
                            type="text"
                            defaultValue="./tests/playwright"
                            placeholder="Path to Playwright tests"
                        />
                    </div>

                    <div className="form-group">
                        <label>🐍 Pytest</label>
                        <input
                            type="text"
                            defaultValue="./tests/pytest"
                            placeholder="Path to Pytest tests"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
