import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  refresh: string | null
  user: { id: number; username: string; first_name: string; last_name: string; role?: string } | null
  setAuth: (token: string, refresh: string, user: AuthState['user']) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refresh: null,
      user: null,
      setAuth: (token, refresh, user) => set({ token, refresh, user }),
      logout: () => set({ token: null, refresh: null, user: null }),
    }),
    { name: 'optuce-auth' }
  )
)
