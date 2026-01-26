import { useImageStore } from "@/zustand/image-store"

interface RotateImagePreviewProps {
  rotationAngle: number
  ref?: React.Ref<HTMLImageElement | null>
}

export default function RotateImagePreview({ ref, rotationAngle }: RotateImagePreviewProps) {
  const {
      previewUrl,
    } = useImageStore()
  return (
    <div className=" h-full flex justify-center items-center">
      <img
        ref={ref}
        src={previewUrl || ""}
        alt="crop-image"
        className="h-96 object-contain overflow-hidden"
        style={{ transform: `rotate(${rotationAngle}deg)` }}
      />
    </div>
  )
}
