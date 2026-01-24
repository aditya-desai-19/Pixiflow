"use client"

import { useImageStore } from "@/zustand/image-store"
import { useEffect, useState } from "react"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { AspectRatio } from "./types"

interface CropPreviewProps {
  croppedWidth: number
  croppedHeight: number
  aspectRatio: AspectRatio
  onCroppedWidthChange: (value: number) => void
  onCroppedHeightChange: (value: number) => void
}

export default function CropPreview({
  croppedWidth,
  croppedHeight,
  aspectRatio,
  onCroppedWidthChange,
  onCroppedHeightChange,
}: CropPreviewProps) {
  const {
    previewUrl,
    height: originalHeight,
    width: originalWidth,
    clearImage: onCancel,
  } = useImageStore()
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 65,
    width: 50,
    height: 50,
  })

  const onComplete = (c: Crop) => {
    onCroppedWidthChange(Math.round(c.width))
    onCroppedHeightChange(Math.round(c.height))
  }

  useEffect(() => {
    setCrop({
      unit: "%",
      width: (croppedWidth / originalWidth) * 100,
      height: (croppedHeight / originalHeight) * 100,
      x: ((originalWidth - croppedWidth) / 2 / originalWidth) * 100,
      y: ((originalHeight - croppedHeight) / 2 / originalHeight) * 100,
    })
  }, [croppedWidth, croppedHeight])

  return (
    <div className=" h-full flex justify-center items-center">
      <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        aspect={Number(aspectRatio)}
        onComplete={onComplete}
      >
        {/*make image more responsive */}
        <img
          src={previewUrl || ""}
          alt="crop-image"
          className="h-96 object-contain"
        />
      </ReactCrop>
    </div>
  )
}
