"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PrimaryButton, SecondaryButton } from "./button"

export default function Header() {
  const [open, setOpen] = useState<boolean>(false)

  const router = useRouter()

  return (
    <nav className="relative flex justify-between items-center p-4 border-surface-tertiary border-b-2">
      <Link href={"/"} className="text-2xl">
        {"Pixiflow"}
      </Link>
      <Button
        className="bg-surface-primary text-primary lg:hidden"
        onClick={() => {
          console.log("clicked")
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
