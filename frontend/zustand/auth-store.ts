import { create } from "zustand"

const initialState = { isLoggedIn: false, userName: "", userEmail: "" }

type AuthState = typeof initialState & {
  setIsLoggedIn: (val: boolean) => void
  setUserName: (name: string) => void
  setUserEmail: (email: string) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,
  setIsLoggedIn: (val: boolean) => set(() => ({ isLoggedIn: val })),
  setUserName: (name: string) => set(() => ({ userName: name })),
  setUserEmail: (email: string) => set((s) => ({ userEmail: email })),
  reset: () => set(initialState),
}))
