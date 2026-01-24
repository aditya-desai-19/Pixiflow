"use client"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/zustand/auth-store"
import { Image } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChangeEvent, useRef } from "react"
import { useImageStore } from "@/zustand/image-store"

export default function FileInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { isLoggedIn } = useAuthStore()
  const { setImage } = useImageStore()

  const router = useRouter()

  const onFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    if (selected) {
      setImage(selected)
      router.push("/resize")
    }
  }

  const onClick = () => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    inputRef.current?.click()
  }

  return (
    <div className="flex justify-center items-center my-16">
      <div className="bg-primary w-3/4 p-12 flex flex-col justify-center items-center gap-1 text-foreground shadow-md shadow-brand-primary lg:w-1/2">
        <Image
          size={55}
          strokeWidth={1}
          strokeOpacity={1}
          className="my-2 text-lg text-background"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileUpload}
        />
        <Button
          variant={"outline"}
          className="text-lg cursor-pointer px-12 py-6 my-1 rounded-2xl"
          onClick={onClick}
        >
          {"Select image"}
        </Button>
        <p className="text-xs text-muted">{"Max file size: 5 mb"}</p>
      </div>
    </div>
  )
}
