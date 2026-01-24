import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CropMenu from "./crop-menu"
import CropPreview from "./crop-preview"
import { useImageStore } from "@/zustand/image-store"
import { useEffect, useState } from "react"
import { AspectRatio } from "./types"

interface CropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}



export default function CropDialog({ open, onOpenChange }: CropDialogProps) {
  const {
    file,
    previewUrl,
    height: originalHeight,
    width: originalWidth,
  } = useImageStore()

  const [croppedWidth, setCroppedWidth] = useState<number>(originalWidth)
  const [croppedHeight, setCroppedHeight] = useState<number>(originalHeight)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.Freeform)

  const onCroppedWidthChange = (value: number) => {
    setCroppedWidth(value)
  }

  const onCroppedHeightChange = (value: number) => {
    setCroppedHeight(value)
  }

  const onAspectRatioChange = (value: AspectRatio) => {
    setAspectRatio(value)
  }

  useEffect(() => {
    setCroppedWidth(originalWidth)
    setCroppedHeight(originalHeight)
  }, [originalWidth, originalHeight])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[calc(100vh-120px)] md:min-h-[80vh] w-[80vw] max-w-none! p-0! m-0! overflow-hidden">
        <DialogHeader className="px-4 py-2">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1">
          <div className="w-[60%] bg-gray-100 p-2">
            <CropPreview croppedWidth={croppedWidth} croppedHeight={croppedHeight} aspectRatio={aspectRatio} onCroppedHeightChange={onCroppedHeightChange} onCroppedWidthChange={onCroppedWidthChange} />
          </div>
          <div className="flex-1 border-l-2">
            <CropMenu
              originalHeight={originalHeight}
              originalWidth={originalWidth} 
              croppedWidth={croppedWidth}
              croppedHeight={croppedHeight}
              aspectRatio={aspectRatio}
              onCroppedWidthChange={onCroppedWidthChange}
              onCroppedHeightChange={onCroppedHeightChange}
              onAspectRatioChange={onAspectRatioChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
