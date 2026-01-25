import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CropMenu from "./crop-menu"
import CropPreview from "./crop-preview"
import { useImageStore } from "@/zustand/image-store"
import { useEffect, useRef, useState } from "react"
import { AspectRatio } from "./types"
import { PixelCrop } from "react-image-crop"

interface CropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CropDialog({ open, onOpenChange }: CropDialogProps) {
  const {
    file,
    height: originalHeight,
    width: originalWidth,
    setImage,
    setChangedDimensions,
  } = useImageStore()

  const [croppedWidth, setCroppedWidth] = useState<number>(originalWidth)
  const [croppedHeight, setCroppedHeight] = useState<number>(originalHeight)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    AspectRatio.Freeform
  )
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)

  const onCroppedWidthChange = (value: number) => {
    setCroppedWidth(value)
  }

  const onCroppedHeightChange = (value: number) => {
    setCroppedHeight(value)
  }

  const onAspectRatioChange = (value: AspectRatio) => {
    setAspectRatio(value)
  }

  async function getCroppedImageBlob(image: HTMLImageElement, crop: PixelCrop) {
    const canvas = document.createElement("canvas")

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY

    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    )

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Failed to crop image"))
        }
      }, "image/png")
    })
  }

  const onCropClick = async () => {
    try {
      if (!file || !completedCrop || !imgRef.current) return
      const croppedImageBlob = await getCroppedImageBlob(
        imgRef.current,
        completedCrop
      )

      if (!croppedImageBlob) return
      const croppedFile = new File([croppedImageBlob], file.name, {
        type: "image/png",
      })
      setImage(croppedFile)
      setChangedDimensions(completedCrop.width, completedCrop.height)
      onOpenChange(false)
    } catch (error) {
      console.error("Error cropping image:", error)
    }
  }

  useEffect(() => {
    setCroppedWidth(originalWidth)
    setCroppedHeight(originalHeight)
  }, [originalWidth, originalHeight])

  useEffect(() => {
    if (!open) {
      setCompletedCrop(undefined)
      imgRef.current = null
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[calc(100vh-120px)] md:min-h-[80vh] w-[80vw] max-w-none! p-0! m-0! overflow-hidden">
        <DialogHeader className="px-4 py-2">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1">
          <div className="w-[60%] bg-gray-100 p-2">
            <CropPreview
              croppedWidth={croppedWidth}
              croppedHeight={croppedHeight}
              aspectRatio={aspectRatio}
              imgRef={imgRef}
              setCompletedCrop={setCompletedCrop}
            />
          </div>
          <div className="flex-1 border-l-2">
            <CropMenu
              originalHeight={originalHeight}
              originalWidth={originalWidth}
              croppedWidth={croppedWidth}
              croppedHeight={croppedHeight}
              aspectRatio={aspectRatio}
              completedCrop={completedCrop}
              onCroppedWidthChange={onCroppedWidthChange}
              onCroppedHeightChange={onCroppedHeightChange}
              onAspectRatioChange={onAspectRatioChange}
              onCropClick={onCropClick}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
