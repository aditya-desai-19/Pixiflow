"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import SizeContainer from "./size-container"
import { useState } from "react"
import PercentageContainer from "./percentage-container"
import { IconButton } from "../../ui/button"
import { ArrowRightFromLine } from "lucide-react"
import { Format } from "./types"
import { useImageStore } from "@/zustand/image-store"

export default function LeftSidebar() {
  const [formatType, setFormatType] = useState<Format>(Format.Size)

  const {
    aspectRatio,
    height: originalHeight,
    width: originalWidth,
  } = useImageStore()
  const [height, setHeight] = useState<number>(originalHeight)
  const [width, setWidth] = useState<number>(originalWidth)
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState<boolean>(false)

  const onFormatChange = (value: Format) => {
    setFormatType(value)
  }

  const onLockAspectRatio = () => {
    setIsAspectRatioLocked(!isAspectRatioLocked)
  }

  const onHeightChange = (newHeight: number) => {
    if (isAspectRatioLocked) {
      const newWidth = Math.round(newHeight * aspectRatio)
      setWidth(newWidth)
    }
    setHeight(newHeight)
  }

  const onWidthChange = (newWidth: number) => {
    if (isAspectRatioLocked) {
      const newHeight = Math.round(newWidth / aspectRatio)
      setHeight(newHeight)
    }
    setWidth(newWidth)
  }

  return (
    <div className="border-r-2 border-surface-tertiary h-full p-4 flex flex-col">
      <h2 className="text-2xl font-semibold my-2">{"Resize Settings"}</h2>
      <ToggleGroup
        type="single"
        className="w-full grid grid-cols-2 mt-8 mb-4 border-2 border-surface-tertiary"
        value={formatType}
        onValueChange={onFormatChange}
      >
        <ToggleGroupItem value="size" className="w-full">
          {"By size"}
        </ToggleGroupItem>

        <ToggleGroupItem value="percentage" className="w-full" disabled>
          {"By percentage"}
        </ToggleGroupItem>
      </ToggleGroup>
      {formatType === Format.Size ? (
        <SizeContainer
          height={height}
          width={width}
          onLockAspectRatio={onLockAspectRatio}
          onHeightChange={onHeightChange}
          onWidthChange={onWidthChange}
        />
      ) : (
        <PercentageContainer />
      )}
      <div className="my-16">
        <IconButton
          icon={<ArrowRightFromLine className="w-6! h-6!" />}
          title="Export"
          variant={"default"}
          className="bg-brand-primary p-8 text-xl hover:bg-brand-hover cursor-pointer w-full disabled:bg-brand-disabled"
        />
      </div>
    </div>
  )
}
