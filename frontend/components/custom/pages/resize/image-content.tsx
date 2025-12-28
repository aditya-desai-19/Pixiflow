"use client"

import { useImageStore } from "@/zustand/image-store"
import ImageCard from "./image-card"
import FileInput from "./file-input"

export default function ImageContent() {
  const { file } = useImageStore()
  return (
    <div className="h-full p-4">{file ? <ImageCard /> : <FileInput />}</div>
  )
}
