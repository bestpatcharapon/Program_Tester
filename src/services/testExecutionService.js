// Test Execution Service
import api from './api'

class TestExecutionService {
  constructor() {
    this.runningTests = new Map()
    this.listeners = new Map()
  }

  // รัน test เดี่ยว
  async runSingleTest(testCase) {
    const testId = testCase.id
    
    try {
      // เริ่มต้น test
      this.notifyListeners(testId, {
        status: 'running',
        progress: 0,
        message: `Starting ${testCase.framework} test...`
      })

      // เรียก API ตาม framework
      let result
      switch (testCase.framework) {
        case 'playwright':
          result = await this.runPlaywrightTest(testCase)
          break
        case 'pytest':
          result = await this.runPytestTest(testCase)
          break
        case 'robot':
          result = await this.runRobotTest(testCase)
          break
        default:
          throw new Error(`Unknown framework: ${testCase.framework}`)
      }

      // แจ้งผลลัพธ์
      this.notifyListeners(testId, {
        status: result.passed ? 'passed' : 'failed',
        progress: 100,
        message: result.message,
        duration: result.duration,
        evidence: result.evidence
      })

      return result

    } catch (error) {
      this.notifyListeners(testId, {
        status: 'failed',
        progress: 100,
        message: error.message,
        error: error
      })
      throw error
    }
  }

  // รัน Playwright test
  async runPlaywrightTest(testCase) {
    const response = await api.post('/api/playwright/run', {
      testName: testCase.name,
      tags: testCase.tags,
      priority: testCase.priority,
      description: testCase.description
    })

    return {
      passed: response.data.status === 'passed',
      message: response.data.message,
      duration: response.data.duration,
      evidence: response.data.screenshots || []
    }
  }

  // รัน Pytest test
  async runPytestTest(testCase) {
    const response = await api.post('/api/pytest/run', {
      testName: testCase.name,
      tags: testCase.tags,
      priority: testCase.priority
    })

    return {
      passed: response.data.status === 'passed',
      message: response.data.message,
      duration: response.data.duration,
      evidence: []
    }
  }

  // รัน Robot Framework test
  async runRobotTest(testCase) {
    const response = await api.post('/api/robot/run', {
      testName: testCase.name,
      tags: testCase.tags,
      priority: testCase.priority
    })

    return {
      passed: response.data.status === 'passed',
      message: response.data.message,
      duration: response.data.duration,
      evidence: response.data.screenshots || [],
      reportUrl: response.data.reportUrl
    }
  }

  // รัน test หลายตัวพร้อมกัน
  async runBatchTests(testCases, options = {}) {
    const {
      parallel = false,
      maxConcurrent = 3,
      onProgress = null
    } = options

    const results = []
    
    if (parallel) {
      // รันแบบ parallel
      const chunks = this.chunkArray(testCases, maxConcurrent)
      
      for (const chunk of chunks) {
        const chunkResults = await Promise.allSettled(
          chunk.map(test => this.runSingleTest(test))
        )
        results.push(...chunkResults)
        
        if (onProgress) {
          onProgress({
            completed: results.length,
            total: testCases.length,
            percentage: (results.length / testCases.length) * 100
          })
        }
      }
    } else {
      // รันแบบ sequential
      for (let i = 0; i < testCases.length; i++) {
        const result = await this.runSingleTest(testCases[i])
        results.push({ status: 'fulfilled', value: result })
        
        if (onProgress) {
          onProgress({
            completed: i + 1,
            total: testCases.length,
            percentage: ((i + 1) / testCases.length) * 100
          })
        }
      }
    }

    return results
  }

  // รัน test ทั้งกลุ่ม
  async runTestGroup(groupName, testCases, options = {}) {
    console.log(`Running test group: ${groupName}`)
    return this.runBatchTests(testCases, options)
  }

  // Subscribe to test updates
  subscribe(testId, callback) {
    if (!this.listeners.has(testId)) {
      this.listeners.set(testId, [])
    }
    this.listeners.get(testId).push(callback)
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(testId)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Notify listeners
  notifyListeners(testId, update) {
    const callbacks = this.listeners.get(testId) || []
    callbacks.forEach(callback => callback(update))
  }

  // Helper: แบ่ง array เป็น chunks
  chunkArray(array, size) {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  // สร้าง Test Report
  async generateReport(testResults, options = {}) {
    const {
      format = 'html',
      includeEvidence = true
    } = options

    const response = await api.post('/api/reports/generate', {
      results: testResults,
      format: format,
      includeEvidence: includeEvidence,
      timestamp: new Date().toISOString()
    })

    return response.data
  }

  // Export results เป็น Excel
  exportToExcel(testResults) {
    const data = testResults.map(result => ({
      'Test Name': result.testName,
      'Status': result.status,
      'Duration': result.duration,
      'Framework': result.framework,
      'Message': result.message,
      'Timestamp': result.timestamp
    }))

    // จะใช้ xlsx library ในการ export
    return data
  }
}

// Export singleton instance
const testExecutionService = new TestExecutionService()
export default testExecutionService
