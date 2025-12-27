"use client"

import { userClient } from "@/api/client"
import { useAuthStore } from "@/zustand/auth-store"
import { useEffect } from "react"
import { AuthHandlerProps } from "./types"

export default function AuthHandler({ token }: AuthHandlerProps) {
  const { setIsLoggedIn, setUserEmail, setUserName, userEmail, userName } =
    useAuthStore()

  useEffect(() => {
    const handleAuth = async (token: string | undefined) => {
      if (!token) {
        setIsLoggedIn(false)
        return
      }

      setIsLoggedIn(true)

      try {
        const user = await userClient.getUser()

        if (user.name !== userName) {
          setUserName(user.name)
        }
        if (user.email !== userEmail) {
          setUserEmail(user.email)
        }
      } catch (error) {
        console.error("Failed to fetch user data", error)
        setIsLoggedIn(false)
      }
    }

    handleAuth(token)
  }, [token])

  return null
}
