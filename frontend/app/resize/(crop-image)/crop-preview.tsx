"use client"

import { useImageStore } from "@/zustand/image-store"
import Image from "next/image"
import { useState } from "react"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

export default function CropPreview() {
  const {
    file,
    previewUrl,
    height: originalHeight,
    width: originalWidth,
    changedHeight,
    changedWidth,
    clearImage: onCancel,
  } = useImageStore()
  const [crop, setCrop] = useState<Crop>()

  return (
    <div className=" h-full flex justify-center items-center">
      <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
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
