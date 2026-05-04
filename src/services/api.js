import axios from 'axios'

const API_BASE = 'https://aiagentautobg.onrender.com'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('api_key')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('api_key')
      window.location.href = '/settings'
    }
    return Promise.reject(error)
  }
)

export const generateApp = async (data) => {
  return api.post('/api/generate', data)
}

export const getStatus = async (jobId) => {
  return api.get(`/api/status/${jobId}`)
}

export const downloadProject = async (jobId, type) => {
  return api.get(`/api/download/${jobId}/${type}`, {
    responseType: 'blob'
  })
}

export const deployProject = async (jobId, platform) => {
  return api.post(`/api/deploy/${jobId}`, { platform })
}

export const getProjects = async () => {
  return api.get('/api/projects')
}

export const getProjectFiles = async (jobId) => {
  return api.get(`/api/projects/${jobId}/files`)
}

export default api