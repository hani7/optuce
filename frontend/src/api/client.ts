import axios from 'axios'
import { useAuthStore } from '../store/auth'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(cfg => {
  const token = useAuthStore.getState().token
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  async err => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ── Typed helpers ──────────────────────────────────────────────────────────────
export const patientsApi = {
  list: (params?: object) => api.get('/patients/', { params }),
  get: (id: number) => api.get(`/patients/${id}/`),
  create: (data: object) => api.post('/patients/', data),
  update: (id: number, data: object) => api.patch(`/patients/${id}/`, data),
  dossier: (id: number) => api.get(`/patients/${id}/dossier/`),
}
export const examensApi = {
  list: (params?: object) => api.get('/examens/', { params }),
  create: (data: object) => api.post('/examens/', data),
  update: (id: number, data: object) => api.patch(`/examens/${id}/`, data),
}
export const monturesApi = {
  list: (params?: object) => api.get('/montures/', { params }),
  create: (data: object) => api.post('/montures/', data),
  update: (id: number, data: object) => api.patch(`/montures/${id}/`, data),
  delete: (id: number) => api.delete(`/montures/${id}/`),
  stockFaible: () => api.get('/montures/stock-faible/'),
}
export const ventesApi = {
  list: (params?: object) => api.get('/ventes/', { params }),
  get: (id: number) => api.get(`/ventes/${id}/`),
  create: (data: object) => api.post('/ventes/', data),
  update: (id: number, data: object) => api.patch(`/ventes/${id}/`, data),
  stats: () => api.get('/ventes/dashboard-stats/'),
  exportG50: () => api.get('/ventes/export-g50/', { responseType: 'blob' }),
}
export const paiementsApi = {
  create: (data: object) => api.post('/paiements/', data),
}
export const commandesApi = {
  list: (params?: object) => api.get('/commandes-verres/', { params }),
  create: (data: object) => api.post('/commandes-verres/', data),
  update: (id: number, data: object) => api.patch(`/commandes-verres/${id}/`, data),
}
export const reparationsApi = {
  list: (params?: object) => api.get('/reparations/', { params }),
  create: (data: object) => api.post('/reparations/', data),
  update: (id: number, data: object) => api.patch(`/reparations/${id}/`, data),
}
export const chifaApi = {
  list: (params?: object) => api.get('/chifa/', { params }),
  create: (data: object) => api.post('/chifa/', data),
  calculer: (id: number) => api.post(`/chifa/${id}/calculer/`),
}
export const marqueApi = { list: () => api.get('/marques/') }
export const fournisseurApi = { list: () => api.get('/fournisseurs/') }
export const verresApi = { list: (params?: object) => api.get('/verres/', { params }) }
export const lentillesApi = {
  list: (params?: object) => api.get('/lentilles/', { params }),
  alertes: () => api.get('/lentilles/alertes-peremption/'),
}
export const devisApi = {
  list: (params?: object) => api.get('/devis/', { params }),
  create: (data: object) => api.post('/devis/', data),
}
export const clotureCaisseApi = {
  list: () => api.get('/clotures-caisse/'),
  create: (data: object) => api.post('/clotures-caisse/', data),
}
