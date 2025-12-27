import { ImageContent, LeftSidebar } from "@/components/custom/pages/resize"

export default function Resize() {
  return (
    <div className="flex h-full">
      <div className="w-[30%]">
        <LeftSidebar />
      </div>

      <div className="w-[70%]">
        <ImageContent />
      </div>
    </div>
  )
}
