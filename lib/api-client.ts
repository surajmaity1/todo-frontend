import axios from 'axios'

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://services.realdevsquad.com/staging-todo'

export const apiClient = axios.create({
  baseURL: backendUrl,
  timeout: 30000,
  withCredentials: true,
})

apiClient.interceptors.request.use(
  async (config) => {
    config.headers.set('Content-Type', 'application/json')
    return config
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)))
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const pathname = window.location.pathname

    if (error.response && error.response.status === 401 && pathname !== '/') {
      window.location.href = '/'
    }

    return Promise.reject(error instanceof Error ? error : new Error(String(error)))
  },
)
