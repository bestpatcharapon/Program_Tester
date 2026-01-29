import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/api/health')
    return response.data
  }

  // Get statistics
  async getStats() {
    const response = await this.client.get('/api/stats')
    return response.data
  }

  // Run tests
  async runTests(config) {
    const response = await this.client.post('/api/tests/run', config)
    return response.data
  }

  // Get test status
  async getTestStatus(testId) {
    const response = await this.client.get(`/api/tests/${testId}/status`)
    return response.data
  }

  // Get evidence files
  async getEvidence() {
    const response = await this.client.get('/api/evidence')
    return response.data
  }

  // Delete evidence file
  async deleteEvidence(filename) {
    const response = await this.client.delete(`/api/evidence/${filename}`)
    return response.data
  }

  // Save environment config
  async saveEnvironmentConfig(env, config) {
    const response = await this.client.post(`/api/config/environment?env=${env}`, config)
    return response.data
  }

  // Get environment config
  async getEnvironmentConfig(env) {
    const response = await this.client.get(`/api/config/environment/${env}`)
    return response.data
  }
}

export default new ApiService()
