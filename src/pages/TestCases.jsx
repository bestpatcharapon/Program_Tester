import { useState } from 'react'
import * as XLSX from 'xlsx'
import {
    Upload,
    FileSpreadsheet,
    Play,
    Trash2,
    Download,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Plus,
    Search,
    ChevronDown,
    ChevronRight
} from 'lucide-react'
import './TestCases.css'

const TestCases = () => {
    const [testCases, setTestCases] = useState([])
    const [groupedTests, setGroupedTests] = useState({})
    const [selectedFile, setSelectedFile] = useState(null)
    const [importing, setImporting] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterFramework, setFilterFramework] = useState('all')
    const [expandedGroups, setExpandedGroups] = useState({})
    const [importPreview, setImportPreview] = useState(null)

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        setSelectedFile(file)
        setImporting(true)

        try {
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data)
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]

            // อ่านข้อมูลทั้งหมดรวม header
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

            console.log('📊 Total rows in Excel:', jsonData.length)
            console.log('📋 Raw Excel Data (first 5 rows):')
            jsonData.slice(0, 5).forEach((row, i) => {
                console.log(`  Row ${i + 1}:`, row)
            })
            // หา header row (แถวที่มี "Module Name" หรือ "Test Case Description")
            let headerRowIndex = -1
            for (let i = 0; i < Math.min(10, jsonData.length); i++) {
                const row = jsonData[i]
                if (Array.isArray(row) && row.length > 0) {
                    const rowStr = row.join('|').toLowerCase()
                    // ค้นหาหลายรูปแบบ
                    if (rowStr.includes('module name') ||
                        rowStr.includes('test case description') ||
                        rowStr.includes('tc id') ||
                        rowStr.includes('test name') ||
                        rowStr.includes('priority') ||
                        rowStr.includes('type') ||
                        rowStr.includes('framework')) {
                        headerRowIndex = i
                        console.log(`✅ Found header at row ${i + 1}:`, row)
                        break
                    }
                }
            }

            if (headerRowIndex === -1) {
                // ถามผู้ใช้ว่า header อยู่แถวไหน
                const userInput = prompt(
                    'ไม่พบ Header อัตโนมัติ\n\n' +
                    'กรุณาระบุว่า Header (หัวตาราง) อยู่ที่แถวที่เท่าไหร่?\n' +
                    '(ตัวอย่าง: ถ้า Header อยู่แถวที่ 3 ให้ใส่ "3")',
                    '1'
                )

                if (!userInput) {
                    setImporting(false)
                    return
                }

                headerRowIndex = parseInt(userInput) - 1

                if (isNaN(headerRowIndex) || headerRowIndex < 0 || headerRowIndex >= jsonData.length) {
                    alert('แถวที่ระบุไม่ถูกต้อง')
                    setImporting(false)
                    return
                }

                console.log(`Using user-specified header at row ${headerRowIndex + 1}`)
            }
            // แปลงข้อมูลโดยใช้ header ที่เจอ
            const headers = jsonData[headerRowIndex]
            const dataRows = jsonData.slice(headerRowIndex + 1)

            // แปลงเป็น object array
            const parsedData = dataRows
                .filter(row => row && row.length > 0 && row.some(cell => cell !== null && cell !== undefined && cell !== ''))
                .map(row => {
                    const obj = {}
                    headers.forEach((header, index) => {
                        if (header) {
                            obj[header] = row[index]
                        }
                    })
                    return obj
                })

            console.log('Parsed data with headers:', parsedData.slice(0, 3))

            // ตรวจสอบหัวข้อที่มีในไฟล์
            const detectedHeaders = headers.filter(h => h)

            // แสดง preview ก่อน import
            setImportPreview({
                fileName: file.name,
                totalRows: parsedData.length,
                headers: detectedHeaders,
                data: parsedData.slice(0, 5) // แสดง 5 แถวแรก
            })

            // สร้าง test cases จากข้อมูล
            const newTests = parsedData.map((row, index) => {
                // Debug: แสดงข้อมูลดิบ
                console.log(`Row ${index + 1}:`, row)

                // ตรวจสอบว่ามี column ไหนบ้าง (รองรับทุกรูปแบบ รวมภาษาไทย)
                const testName =
                    row['Test Case Description'] ||  // รูปแบบของ User
                    row['Test Name'] ||
                    row['TestName'] ||
                    row['Name'] ||
                    row['Test Case'] ||
                    row['test_name'] ||
                    row['TC ID'] ||  // ใช้ TC ID เป็น fallback
                    `Test ${index + 1}`

                // Framework mapping - รองรับทั้ง Type และ Framework
                let frameworkRaw = (
                    row['Type'] ||  // รูปแบบของ User
                    row['Framework'] ||
                    row['framework'] ||
                    row['type'] ||
                    'UI'
                ).toString().toLowerCase()

                // แปลง Type เป็น Framework
                let framework = 'playwright'  // default
                if (frameworkRaw.includes('ui') || frameworkRaw.includes('e2e') || frameworkRaw.includes('function')) {
                    framework = 'playwright'
                } else if (frameworkRaw.includes('api') || frameworkRaw.includes('pytest')) {
                    framework = 'pytest'
                } else if (frameworkRaw.includes('robot')) {
                    framework = 'robot'
                }

                // Priority mapping
                let priorityRaw = (
                    row['priority'] ||  // รูปแบบของ User (lowercase)
                    row['Priority'] ||
                    'medium'
                ).toString().toLowerCase()

                let priority = 'medium'  // default
                if (priorityRaw.includes('high') || priorityRaw.includes('critical')) {
                    priority = 'high'
                } else if (priorityRaw.includes('low')) {
                    priority = 'low'
                } else if (priorityRaw.includes('middle') || priorityRaw.includes('medium')) {
                    priority = 'medium'
                }

                // Parse tags - รองรับทั้ง string และ array
                let tags = []
                const tagsData = row['Tags'] || row['tags'] || row['Tag'] || row['Test Objective'] || ''
                if (typeof tagsData === 'string' && tagsData) {
                    tags = tagsData.split(',').map(t => t.trim()).filter(t => t)
                    // ถ้า tags ยาวเกินไป ให้เอาแค่ส่วนแรก
                    if (tags.length === 1 && tags[0].length > 50) {
                        tags = [tags[0].substring(0, 50) + '...']
                    }
                } else if (Array.isArray(tagsData)) {
                    tags = tagsData
                }

                // ถ้าไม่มี tags ให้ใช้ Type เป็น tag
                if (tags.length === 0 && row['Type']) {
                    tags = [row['Type']]
                }

                // Description - รวมหลายฟิลด์
                const description =
                    row['Test Objective'] ||
                    row['Description'] ||
                    row['Details'] ||
                    row['description'] ||
                    row['details'] ||
                    row['Expected Result'] ||
                    ''

                // Category - ใช้ Module Name หรือ Test Scenario Description
                const category =
                    row['Module Name'] ||  // รูปแบบของ User
                    row['Test Scenario Description'] ||
                    row['Category'] ||
                    row['Module'] ||
                    row['Feature'] ||
                    row['category'] ||
                    row['module'] ||
                    row['feature'] ||
                    'General'

                const testCase = {
                    id: Date.now() + index,
                    name: testName,
                    framework: framework,
                    priority: priority,
                    status: 'pending',
                    tags: tags,
                    description: description,
                    category: category,
                    lastRun: null,
                    rawData: row // เก็บข้อมูลดิบไว้
                }

                // Debug: แสดงผลลัพธ์
                console.log(`Parsed Test ${index + 1}:`, testCase)

                return testCase
            })

            console.log('Total tests imported:', newTests.length)
            console.log('All tests:', newTests)

            // จัดกลุ่มตาม category
            const grouped = newTests.reduce((acc, test) => {
                const category = test.category
                if (!acc[category]) {
                    acc[category] = []
                }
                acc[category].push(test)
                return acc
            }, {})

            console.log('Grouped tests:', grouped)

            setTestCases([...testCases, ...newTests])
            setGroupedTests(grouped)

            // Auto-expand ทุกกลุ่ม
            const expanded = {}
            Object.keys(grouped).forEach(key => {
                expanded[key] = true
            })
            setExpandedGroups(expanded)

            setTimeout(() => {
                setImporting(false)
                setImportPreview(null)
            }, 1500)

        } catch (error) {
            console.error('Error reading Excel file:', error)
            alert(`ไม่สามารถอ่านไฟล์ได้: ${error.message}`)
            setImporting(false)
            setImportPreview(null)
        }
    }

    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }))
    }

    const handleRunTest = (testId) => {
        setTestCases(testCases.map(tc =>
            tc.id === testId
                ? { ...tc, status: 'running', lastRun: new Date().toLocaleString() }
                : tc
        ))

        setTimeout(() => {
            const passed = Math.random() > 0.3
            setTestCases(testCases.map(tc =>
                tc.id === testId
                    ? { ...tc, status: passed ? 'passed' : 'failed' }
                    : tc
            ))
        }, 3000)
    }

    const handleDeleteTest = (testId) => {
        const updatedTests = testCases.filter(tc => tc.id !== testId)
        setTestCases(updatedTests)

        // อัพเดทกลุ่ม
        const grouped = updatedTests.reduce((acc, test) => {
            const category = test.category
            if (!acc[category]) {
                acc[category] = []
            }
            acc[category].push(test)
            return acc
        }, {})
        setGroupedTests(grouped)
    }

    const downloadTemplate = () => {
        const template = [
            {
                'Test Name': 'Login with valid credentials',
                'Category': 'Authentication',
                'Framework': 'playwright',
                'Priority': 'high',
                'Tags': 'smoke,login',
                'Description': 'Test user login with correct username and password'
            },
            {
                'Test Name': 'API - Create User',
                'Category': 'User Management',
                'Framework': 'pytest',
                'Priority': 'medium',
                'Tags': 'api,user,crud',
                'Description': 'Test POST /api/users endpoint'
            },
            {
                'Test Name': 'Checkout Flow',
                'Category': 'E-Commerce',
                'Framework': 'robot',
                'Priority': 'high',
                'Tags': 'e2e,checkout',
                'Description': 'Test complete checkout process'
            }
        ]

        const ws = XLSX.utils.json_to_sheet(template)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Test Cases')
        XLSX.writeFile(wb, 'test_cases_template.xlsx')
    }

    const filteredTests = testCases.filter(tc => {
        const matchesSearch = tc.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFramework = filterFramework === 'all' || tc.framework === filterFramework
        return matchesSearch && matchesFramework
    })

    const frameworks = [
        { id: 'playwright', name: 'Playwright', icon: '🎭', color: '#f59e0b' },
        { id: 'pytest', name: 'Pytest', icon: '🔷', color: '#3b82f6' },
        { id: 'robot', name: 'Robot', icon: '🤖', color: '#a855f7' }
    ]

    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed': return <CheckCircle2 size={18} className="status-icon success" />
            case 'failed': return <XCircle size={18} className="status-icon error" />
            case 'running': return <div className="spinner-small"></div>
            default: return <AlertCircle size={18} className="status-icon pending" />
        }
    }

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high': return 'priority-high'
            case 'medium': return 'priority-medium'
            default: return 'priority-low'
        }
    }

    return (
        <div className="test-cases">
            {/* Header */}
            <div className="test-cases-header">
                <div>
                    <h1>Test Cases</h1>
                    <p className="subtitle">Import และจัดการ test suite จาก Excel</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" onClick={downloadTemplate}>
                        <Download size={18} />
                        Download Template
                    </button>
                    <label className="btn btn-primary">
                        <Upload size={18} />
                        Import Excel
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>
            </div>

            {/* Import Preview */}
            {importPreview && (
                <div className="import-preview glass">
                    <div className="preview-header">
                        <FileSpreadsheet size={24} />
                        <div>
                            <h3>กำลังนำเข้า: {importPreview.fileName}</h3>
                            <p>พบ {importPreview.totalRows} test cases</p>
                        </div>
                    </div>
                    <div className="preview-headers">
                        <strong>หัวข้อที่พบในไฟล์:</strong>
                        <div className="header-chips">
                            {importPreview.headers.map((header, idx) => (
                                <span key={idx} className="header-chip">{header}</span>
                            ))}
                        </div>
                    </div>
                    {importing && (
                        <div className="import-progress">
                            <div className="spinner"></div>
                            <span>กำลังประมวลผล...</span>
                        </div>
                    )}
                </div>
            )}

            {/* Filters */}
            <div className="test-filters glass">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="ค้นหา test cases..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="framework-filters">
                    <button
                        className={`filter-chip ${filterFramework === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterFramework('all')}
                    >
                        All Frameworks
                    </button>
                    {frameworks.map(fw => (
                        <button
                            key={fw.id}
                            className={`filter-chip ${filterFramework === fw.id ? 'active' : ''}`}
                            style={{
                                borderColor: filterFramework === fw.id ? fw.color : 'transparent',
                                color: filterFramework === fw.id ? fw.color : 'inherit'
                            }}
                            onClick={() => setFilterFramework(fw.id)}
                        >
                            <span>{fw.icon}</span>
                            {fw.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grouped Test Cases */}
            {Object.keys(groupedTests).length > 0 ? (
                <div className="grouped-tests">
                    {Object.entries(groupedTests).map(([category, tests]) => {
                        const categoryTests = tests.filter(tc => {
                            const matchesSearch = tc.name.toLowerCase().includes(searchTerm.toLowerCase())
                            const matchesFramework = filterFramework === 'all' || tc.framework === filterFramework
                            return matchesSearch && matchesFramework
                        })

                        if (categoryTests.length === 0) return null

                        return (
                            <div key={category} className="test-group glass">
                                <div
                                    className="group-header"
                                    onClick={() => toggleGroup(category)}
                                >
                                    <div className="group-title">
                                        {expandedGroups[category] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                        <h3>{category}</h3>
                                        <span className="group-count">{categoryTests.length} tests</span>
                                    </div>
                                    <div className="group-stats">
                                        <span className="stat-badge success">
                                            {categoryTests.filter(t => t.status === 'passed').length} ✓
                                        </span>
                                        <span className="stat-badge error">
                                            {categoryTests.filter(t => t.status === 'failed').length} ✗
                                        </span>
                                    </div>
                                </div>

                                {expandedGroups[category] && (
                                    <div className="group-content">
                                        <table className="test-table">
                                            <thead>
                                                <tr>
                                                    <th>Status</th>
                                                    <th>Test Name</th>
                                                    <th>Framework</th>
                                                    <th>Priority</th>
                                                    <th>Tags</th>
                                                    <th>Last Run</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categoryTests.map(test => (
                                                    <tr key={test.id} className="test-row">
                                                        <td>{getStatusIcon(test.status)}</td>
                                                        <td>
                                                            <div className="test-name-cell">
                                                                <div className="test-name">{test.name}</div>
                                                                {test.description && (
                                                                    <div className="test-description">{test.description}</div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="framework-badge" style={{
                                                                borderColor: frameworks.find(f => f.id === test.framework)?.color,
                                                                color: frameworks.find(f => f.id === test.framework)?.color
                                                            }}>
                                                                {frameworks.find(f => f.id === test.framework)?.icon}
                                                                {frameworks.find(f => f.id === test.framework)?.name}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`priority-badge ${getPriorityClass(test.priority)}`}>
                                                                {test.priority}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="tags">
                                                                {test.tags.slice(0, 3).map((tag, idx) => (
                                                                    <span key={idx} className="tag">{tag}</span>
                                                                ))}
                                                                {test.tags.length > 3 && (
                                                                    <span className="tag">+{test.tags.length - 3}</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="last-run">
                                                            {test.lastRun || <span className="text-muted">Never</span>}
                                                        </td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="action-btn run"
                                                                    onClick={() => handleRunTest(test.id)}
                                                                    disabled={test.status === 'running'}
                                                                    title="Run Test"
                                                                >
                                                                    <Play size={16} />
                                                                </button>
                                                                <button
                                                                    className="action-btn delete"
                                                                    onClick={() => handleDeleteTest(test.id)}
                                                                    title="Delete Test"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="empty-state glass">
                    <FileSpreadsheet size={64} />
                    <h3>ยังไม่มี Test Cases</h3>
                    <p>Import test cases จาก Excel หรือสร้างใหม่</p>
                    <button className="btn btn-primary" onClick={downloadTemplate}>
                        <Download size={18} />
                        ดาวน์โหลด Template
                    </button>
                </div>
            )}

            {/* Stats Summary */}
            {testCases.length > 0 && (
                <div className="test-stats">
                    <div className="stat-card">
                        <div className="stat-icon success">
                            <CheckCircle2 size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{testCases.filter(t => t.status === 'passed').length}</span>
                            <span className="stat-label">Passed</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon error">
                            <XCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{testCases.filter(t => t.status === 'failed').length}</span>
                            <span className="stat-label">Failed</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon pending">
                            <AlertCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{testCases.filter(t => t.status === 'pending').length}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon total">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{testCases.length}</span>
                            <span className="stat-label">Total Tests</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TestCases
