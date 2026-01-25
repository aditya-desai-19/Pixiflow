"use client"

import { Badge } from "@/components/ui/badge"
import { useImageStore } from "@/zustand/image-store"
import { ArrowRight, Crop, RefreshCcw, X } from "lucide-react"
import ImageModificationButtons, {
  ImageModificationButton,
} from "./image-modification-buttons"
import CropDialog from "./(crop-image)/crop-dialog"
import { useState } from "react"

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
  const [isCropDialogOpen, setIsCropDialogOpen] = useState<boolean>(false)

  const imageModificationButtons: Array<ImageModificationButton> = [
    {
      icon: <Crop />,
      tooltipMessage: "Crop",
      onClick: () => setIsCropDialogOpen(true),
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
    <div className="flex flex-col border-2 h-full w-full">
      <ImageModificationButtons buttons={imageModificationButtons} />
      <CropDialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen} />
      <div className="border-b-2 p-2 flex flex-1 justify-center items-center">
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
            className="border-surface-tertiary bg-gray-500 text-white"
          >
            {originalWidth} x {originalHeight}
          </Badge>
          <ArrowRight />
          <Badge
            variant={"outline"}
            className="border-surface-tertiary bg-green-500 text-white"
          >
            {changedWidth} x {changedHeight}
          </Badge>
        </div>
      </div>
    </div>
  )
}
