import { ImageContent, ResizeSettings } from "@/components/custom/pages/resize"

export default function Resize() {
  return (
    <div className="flex h-full">
      <div className="hidden lg:w-[30%] lg:flex lg:border-r-2 lg:border-surface-tertiary">
        <ResizeSettings />
      </div>

      <div className="w-full lg:w-[70%]">
        <ImageContent />
      </div>
    </div>
  )
}
