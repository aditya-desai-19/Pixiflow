import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CropMenu from "./crop-image-menu"
import CropPreview from "./crop-image-preview"
import { useImageStore } from "@/zustand/image-store"
import { useEffect, useRef, useState } from "react"
import { AspectRatio } from "./types"
import { PixelCrop } from "react-image-crop"
import CommonImageDialog from "../common-image-dialog"

interface CropImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CropImageDialog({ open, onOpenChange }: CropImageDialogProps) {
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
      }, file?.type)
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
        type: file.type,
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
    <CommonImageDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Crop Image"
      imagePreview={
        <CropPreview
          croppedWidth={croppedWidth}
          croppedHeight={croppedHeight}
          aspectRatio={aspectRatio}
          imgRef={imgRef}
          setCompletedCrop={setCompletedCrop}
        />
      }
      menu={
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
      }
    />
  )
}
