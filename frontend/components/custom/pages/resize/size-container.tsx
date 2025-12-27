"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SizeContainerProps } from "./types"

export default function SizeContainer({
  onLockAspectRatio,
  height,
  width,
  onHeightChange,
  onWidthChange,
}: SizeContainerProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 my-2 relative">
        <div className="flex flex-col gap-2">
          <Label htmlFor="height">{"Height"}</Label>
          <Input
            id="height"
            type="number"
            min={0}
            value={height}
            onChange={(e) => onHeightChange(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="width">{"Width"}</Label>
          <Input
            id="width"
            type="number"
            min={0}
            value={width}
            onChange={(e) => onWidthChange(parseInt(e.target.value) || 0)}
          />
        </div>
        <span className="absolute right-1 top-[-4]">{"px"}</span>
      </div>
      <div className="flex gap-1">
        <Checkbox
          id="aspect-ratio"
          className="border-border data-[state=checked]:bg-brand-primary data-[state=checked]:text-surface-primary data-[state=checked]:border-brand-primary"
          onCheckedChange={onLockAspectRatio}
        />
        <Label htmlFor="aspect-ratio">{"Lock aspect ratio"}</Label>
      </div>
    </div>
  )
}
