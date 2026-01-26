import { useEffect, useRef, useState } from "react"
import CommonImageDialog from "../common-image-dialog"
import RotateImageMenu from "./rotate-image-menu"
import RotateImagePreview from "./rotate-image-preview"
import { useImageStore } from "@/zustand/image-store"

interface RotateImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RotateImageDialog({
  open,
  onOpenChange,
}: RotateImageDialogProps) {
  const { file, setImage } = useImageStore()
  const [rotationAngle, setRotationAngle] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)

  const onRotateClockwise = () => {
    setRotationAngle((prev) => (prev + 90) % 360)
  }

  const onRotateAntiClockwise = () => {
    setRotationAngle((prev) => (prev - 90 + 360) % 360)
  }

  async function rotateImage(
    image: HTMLImageElement,
    rotation: number // 90, 180, 270
  ): Promise<Blob> {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    const angle = (rotation * Math.PI) / 180

    // Swap width/height for 90° & 270°
    if (rotation === 90 || rotation === 270) {
      canvas.width = image.naturalHeight
      canvas.height = image.naturalWidth
    } else {
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
    }

    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(angle)
    ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2)

    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob!), file!.type)
    )
  }

  useEffect(() => {
    if (open || !imgRef.current || rotationAngle === 0 || !file) return
    const rotateAndSetImage = async () => {
      const rotatedBlob = await rotateImage(imgRef.current!, rotationAngle)
      const rotatedFile = new File([rotatedBlob], file.name, {
        type: file.type,
      })
      setImage(rotatedFile)
    }
    rotateAndSetImage()
  }, [open])

  return (
    <CommonImageDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Rotate Image"
      imagePreview={
        <RotateImagePreview ref={imgRef} rotationAngle={rotationAngle} />
      }
      menu={
        <RotateImageMenu
          onRotateClockwise={onRotateClockwise}
          onRotateAntiClockwise={onRotateAntiClockwise}
        />
      }
    />
  )
}
