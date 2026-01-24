"use client"

import { useImageStore } from "@/zustand/image-store"
import ImageCard from "./image-card"
import FileInput from "./file-input"
import PopoverMenu from "./popover-menu"

export default function ImageContent() {
  const { file } = useImageStore()
  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex flex-1 lg:h-full p-4">
        {file ? <ImageCard /> : <FileInput />}
      </div>

      <div className="flex flex-col justify-end w-full my-4 p-2 lg:hidden">
        <PopoverMenu />
      </div>
    </div>
  )
}
