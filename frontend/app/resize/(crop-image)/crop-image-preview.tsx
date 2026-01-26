"use client"

import { useImageStore } from "@/zustand/image-store"
import { RefObject, useEffect, useState } from "react"
import ReactCrop, { PixelCrop, type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { AspectRatio } from "./types"

interface CropPreviewProps {
  croppedWidth: number
  croppedHeight: number
  aspectRatio: AspectRatio
  ref: RefObject<HTMLImageElement | null>
  setCompletedCrop: (crop: PixelCrop) => void
}

export default function CropPreview({
  croppedWidth,
  croppedHeight,
  aspectRatio,
  ref,
  setCompletedCrop,
}: CropPreviewProps) {
  const {
    previewUrl,
    height: originalHeight,
    width: originalWidth,
  } = useImageStore()
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 65,
    width: 50,
    height: 50,
  })


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
        onComplete={(c) => setCompletedCrop(c)}
      >
        {/*make image more responsive */}
        <img
          ref={ref}
          src={previewUrl || ""}
          alt="crop-image"
          className="h-96 object-contain"
        />
      </ReactCrop>
    </div>
  )
}
