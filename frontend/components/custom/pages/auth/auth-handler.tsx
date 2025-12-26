"use client"

import { userClient } from "@/api/client"
import { useAuthStore } from "@/zustand/authStore"
import { useEffect } from "react"

interface AuthHandlerProps {
  token: string | undefined
}

export default function AuthHandler({ token }: AuthHandlerProps) {
  const { setIsLoggedIn, setUserEmail, setUserName } = useAuthStore()

  useEffect(() => {
    const handleAuth = async (token: string | undefined) => {
      setIsLoggedIn(!!token)

      if (token) {
        const user = await userClient.getUser()
        setUserName(user.name)
        setUserEmail(user.email)
      }
    }

    handleAuth(token)
  }, [token])

  return null
}
