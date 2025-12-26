"use client"

import { useAuthStore } from "@/zustand/authStore"
import { useEffect } from "react"

interface AuthHandlerProps {
  token: string | undefined
}

export default function AuthHandler({ token }: AuthHandlerProps) {
  const { setIsLoggedIn } = useAuthStore()

  useEffect(() => {
    setIsLoggedIn(!!token)
  }, [token])

  return null
}
