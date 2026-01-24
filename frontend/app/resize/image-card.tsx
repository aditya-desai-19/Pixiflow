"use client"

import { Badge } from "@/components/ui/badge"
import { useImageStore } from "@/zustand/image-store"
import { ArrowRight, Crop, RefreshCcw, X } from "lucide-react"
import ImageModificationButtons, {
  ImageModificationButton,
} from "./image-modification-buttons"

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

  const imageModificationButtons: Array<ImageModificationButton> = [
    {
      icon: <Crop />,
      tooltipMessage: "Crop",
      onClick: () => console.log("Crop clicked"),
    },
    {
      icon: <RefreshCcw />,
      tooltipMessage: "Rotate",
      onClick: () => console.log("Rotate clicked"),
    },
    {
      icon: <X />,
      tooltipMessage: "Close",
      onClick: onCancel,
    },
  ]

  return (
    <div className="flex justify-center items-center h-full">
      <div className="border-2 border-surface-tertiary overflow-auto w-full rounded-lg">
        <ImageModificationButtons buttons={imageModificationButtons} />
        <div className="border-b-2 p-2 bg-gray-100 flex justify-center items-center">
          {file && (
            <img
              src={previewUrl || ""}
              alt="Preview"
              className="max-h-62.5 md:max-h-80 lg:max-h-96 object-contain"
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
