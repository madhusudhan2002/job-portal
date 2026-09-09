import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://job-portal-xns3.onrender.com/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jp_token')
      localStorage.removeItem('jp_user')
    }
    return Promise.reject(error)
  }
)

export default api
