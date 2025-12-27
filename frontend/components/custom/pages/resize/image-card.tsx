"use client"

import { Badge } from "@/components/ui/badge"
import { useImageStore } from "@/zustand/image-store"
import { ArrowRight } from "lucide-react"

export default function ImageCard() {
  const {
    file,
    previewUrl,
    height: originalHeight,
    width: originalWidth,
    changedHeight,
    changedWidth,
  } = useImageStore()
  return (
    <div className="border-2 border-surface-tertiary">
      <div className="border-b-2 p-4 bg-gray-100">
        {file && (
          <img
            src={previewUrl || ""}
            alt="Preview"
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <p className="font-semibold">{file?.name}</p>
        <div className="flex gap-2">
          <Badge
            variant={"outline"}
            className="border-surface-tertiary bg-gray-500 text-surface-primary"
          >
            {originalWidth} x {originalHeight}
          </Badge>
          <ArrowRight />
          <Badge
            variant={"outline"}
            className="border-surface-tertiary bg-green-500 text-surface-primary"
          >
            {changedWidth} x {changedHeight}
          </Badge>
        </div>
      </div>
    </div>
  )
}
