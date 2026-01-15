"use client"

import Link from "next/link"
import { Button } from "../../../ui/button"
import { LogOut, Menu, User } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/zustand/auth-store"
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
import { useImageStore } from "@/zustand/image-store"

export default function Header() {
  const [open, setOpen] = useState<boolean>(false)
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)
  const { isLoggedIn, reset, userName } = useAuthStore()
  const { clearImage } = useImageStore()

  const router = useRouter()

  const onLogout = async () => {
    setIsLoggingOut(true)
    try {
      await authClient.logoutUser()
      reset()
      clearImage()
      router.replace("/")
    } catch (e) {
      console.error("Some error occurred while logging out")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="relative flex justify-between items-center p-4 border-surface-tertiary border-b-2">
      <div className="flex items-center gap-2 md:gap-24">
        <Link href={"/"} className="text-2xl">
          {"Pixiflow"}
        </Link>
        {isLoggedIn && (
          <div className="flex gap-4">
            <Link href={"/resize"} className="text-sm">
              {"Resize"}
            </Link>
            <Link href={"/my-images"} className="text-sm">
              {"My Images"}
            </Link>
          </div>
        )}
      </div>

      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-32 justify-center"
            >
              <User className="h-4 w-4" />
              <span className="truncate">{userName}</span>
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
            variant={"secondary"}
            className="lg:hidden"
            onClick={() => {
              setOpen(!open)
            }}
          >
            <Menu size={32} strokeOpacity={1} />
          </Button>
          <div className="hidden lg:flex gap-2">
            <div>
              <Button variant={"outline"} onClick={() => router.push("/login")} className="cursor-pointer">{"Login"}</Button>
            </div>
            <div>
              <Button onClick={() => router.push("/signup")} className="cursor-pointer">{"Signup"}</Button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="absolute top-full left-0 w-full bg-surface-primary border-b border-surface-tertiary lg:hidden">
          <div className="flex flex-col gap-2 p-4">
            <Button variant={"outline"} onClick={() => router.push("/login")} className="cursor-pointer">{"Login"}</Button>
            <Button onClick={() => router.push("/signup")} className="cursor-pointer">{"Signup"}</Button>
          </div>
        </div>
      )}
    </nav>
  )
}
