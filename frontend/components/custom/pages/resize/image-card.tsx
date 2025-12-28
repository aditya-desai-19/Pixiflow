"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { useImageStore } from "@/zustand/image-store"
import { TooltipArrow, TooltipContent } from "@radix-ui/react-tooltip"
import { ArrowRight, X } from "lucide-react"

export default function ImageCard() {
  const {
    file,
    previewUrl,
    height: originalHeight,
    width: originalWidth,
    changedHeight,
    changedWidth,
    clearImage: onCancel,
  } = useImageStore()

  return (
    <div className="flex justify-center items-center h-full">
      <div className="border-2 border-surface-tertiary overflow-auto w-64 rounded-lg">
        <div className="flex justify-end p-2 bg-gray-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="cursor-pointer flex justify-center items-center rounded-full p-1 bg-gray-200"
                onClick={onCancel}
              >
                <X className="w-2.5 h-2.5" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-black p-2 rounded-lg">
              <p className="text-sm text-surface-primary">{"Remove Image"}</p>
              <TooltipArrow className="fill-black" />
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="border-b-2 p-2 bg-gray-100 flex justify-center items-center">
          {file && (
            <img
              src={previewUrl || ""}
              alt="Preview"
              className="max-h-62.5 object-contain"
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
    </div>
  )
}
