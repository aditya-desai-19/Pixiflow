import { useImageStore } from "@/zustand/image-store"
import { useRef } from "react"
import { Image } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/zustand/auth-store"
import { IconButton } from "@/components/custom/ui/button"

export default function FileInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { setImage } = useImageStore()
  const { isLoggedIn } = useAuthStore()

  const router = useRouter()

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    const selected = e.target.files?.[0] ?? null
    if (!selected) return

    setImage(selected)
  }

  return (
    <div className="h-full w-full flex justify-center items-center bg-gray-100">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileUpload}
      />
      <div className="w-1/2 flex flex-col justify-center items-center gap-2">
        <IconButton
          icon={<Image className="w-6! h-6!" />}
          title="Select file"
          variant={"default"}
          onClick={() => inputRef.current?.click()}
          className="w-full p-8 text-xl cursor-pointer"
        />
        <span className="text-sm">{"Max file size: 5 MB"}</span>
      </div>
    </div>
  )
}
