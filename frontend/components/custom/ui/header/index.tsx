"use client"

import Link from "next/link"
import { Button } from "../../../ui/button"
import { LoaderCircle, LogOut, Menu, User } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconButton, PrimaryButton, SecondaryButton } from "../button"
import { useAuthStore } from "@/zustand/authStore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu"
import { authClient } from "@/api/client"
import Spinner from "../spinner"

export default function Header() {
  const [open, setOpen] = useState<boolean>(false)
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)
  const { isLoggedIn, reset } = useAuthStore()

  const router = useRouter()

  const onLogout = async () => {
    setIsLoggingOut(true)
    try {
      await authClient.logoutUser()
      reset()
      router.replace("/")
    } catch (e) {
      console.error("Some error occurred while logging out")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="relative flex justify-between items-center p-4 border-surface-tertiary border-b-2">
      <Link href={"/"} className="text-2xl">
        {"Pixiflow"}
      </Link>

      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-32 justify-center"
            >
              <User className="h-4 w-4" />
              {/* todo fetch from server */}
              <span className="truncate">{"Aditya"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{"My Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} disabled={isLoggingOut}>
              {isLoggingOut ? <Spinner /> : <LogOut className="text-red-500" />}{" "}
              <span className="text-red-500">{"Logout"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex">
          <Button
            className="bg-surface-primary text-primary lg:hidden"
            onClick={() => {
              setOpen(!open)
            }}
          >
            <Menu size={32} strokeOpacity={1} />
          </Button>
          <div className="hidden lg:flex gap-2">
            <div>
              <SecondaryButton
                onClick={() => router.push("/login")}
                title="Login"
              />
            </div>
            <div>
              <PrimaryButton
                onClick={() => router.push("/signup")}
                title="Signup"
              />
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="absolute top-full left-0 w-full bg-surface-primary border-b border-surface-tertiary lg:hidden">
          <div className="flex flex-col gap-2 p-4">
            <SecondaryButton onClick={() => {}} title="Login" />
            <PrimaryButton onClick={() => {}} title="Signup" />
          </div>
        </div>
      )}
    </nav>
  )
}
