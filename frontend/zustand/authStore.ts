import { create } from "zustand"

const initialState = { isLoggedIn: false, userName: "" }

type AuthState = typeof initialState & {
  setIsLoggedIn: (val: boolean) => void
  setUserName: (name: string) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,
  setIsLoggedIn: (val: boolean) => set((s) => ({ isLoggedIn: val })),
  setUserName: (name: string) => set((s) => ({ userName: name })),
  reset: () => set(initialState),
}))
