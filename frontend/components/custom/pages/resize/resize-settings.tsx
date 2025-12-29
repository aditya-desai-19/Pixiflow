"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import SizeContainer from "./size-container"
import { useEffect, useState } from "react"
import { IconButton } from "../../ui/button"
import { ArrowRightFromLine } from "lucide-react"
import { Format } from "./types"
import { useImageStore } from "@/zustand/image-store"
import Spinner from "../../ui/spinner"
import { imagesClient } from "@/api/client"
import { UploadImageRequest } from "@/generated"
import PercentageContainer from "./percentage-container"
import CloseButton from "./close-button"

interface ResizeSettingsProps {
  onClose?: () => void
}

export default function ResizeSettings({ onClose }: ResizeSettingsProps) {
  const [formatType, setFormatType] = useState<Format>(Format.Size)

  const {
    file,
    aspectRatio,
    height: originalHeight,
    width: originalWidth,
    changedHeight: height,
    changedWidth: width,
    setChangedDimensions,
  } = useImageStore()
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState<boolean>(false)
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [percentage, setPercentage] = useState<number>(50)

  const onFormatChange = (value: Format) => {
    if (!value) return
    setFormatType(value)
  }

  const onLockAspectRatio = () => {
    setIsAspectRatioLocked(!isAspectRatioLocked)
  }

  const onHeightChange = (newHeight: number) => {
    let newWidth = width
    if (isAspectRatioLocked) {
      newWidth = Math.round(newHeight * aspectRatio)
    }
    setChangedDimensions(newWidth, newHeight)
  }

  const onWidthChange = (newWidth: number) => {
    let newHeight = height
    if (isAspectRatioLocked) {
      newHeight = Math.round(newWidth / aspectRatio)
    }
    setChangedDimensions(newWidth, newHeight)
  }

  const downloadImage = async (imageUrl: string, imageName: string) => {
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")

    a.href = url
    a.download = imageName
    document.body.appendChild(a)
    a.click()

    a.remove()
    window.URL.revokeObjectURL(url)
  }

  const onExport = async () => {
    if (height <= 0 || width <= 0 || !file) {
      //show alert toast
      return
    }

    setIsExporting(true)
    try {
      const body: UploadImageRequest = {
        width: width,
        height: height,
        file: file,
      }
      const res = await imagesClient.uploadImage(body)
      await downloadImage(res.imageUrl, res.imageName)
    } catch (e) {
      console.error("Error exporting image:", e)
    } finally {
      setIsExporting(false)
    }
  }

  const onPercentageChange = (newPercent: number) => {
    setPercentage(newPercent)
    const multipler = (newPercent * 2) / 100
    const newHeight = Math.round(originalHeight * multipler)
    const newWidth = Math.round(originalWidth * multipler)
    setChangedDimensions(newWidth, newHeight)
  }

  useEffect(() => {
    if (isAspectRatioLocked) {
      const newWidth = Math.round(height * aspectRatio)
      setChangedDimensions(newWidth, height)
    }
  }, [isAspectRatioLocked])

  useEffect(() => {
    setChangedDimensions(originalWidth, originalHeight)
  }, [originalHeight, originalWidth])

  return (
    <div className="w-full h-full p-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold my-2">{"Resize Settings"}</h2>
        {onClose && (
          <div className="lg:hidden">
            <CloseButton onClose={onClose} tooltipMessage="Close" />
          </div>
        )}
      </div>

      <ToggleGroup
        type="single"
        className="w-full grid grid-cols-2 mt-8 mb-4 border-2  border-surface-tertiary"
        value={formatType}
        onValueChange={onFormatChange}
      >
        <ToggleGroupItem value="size" className="w-full">
          {"By size"}
        </ToggleGroupItem>

        <ToggleGroupItem value="percentage" className="w-full">
          {"As percentage"}
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="w-full">
        <div className={formatType === Format.Size ? "block" : "hidden"}>
          <SizeContainer
            height={height}
            width={width}
            onLockAspectRatio={onLockAspectRatio}
            onHeightChange={onHeightChange}
            onWidthChange={onWidthChange}
          />
        </div>

        <div className={formatType === Format.Percentage ? "block" : "hidden"}>
          <PercentageContainer
            percentage={percentage}
            onPercentChange={onPercentageChange}
          />
        </div>
      </div>

      <div className="my-16">
        <IconButton
          icon={
            isExporting ? (
              <Spinner className="w-6! h-6! text-surface-primary animate-spin" />
            ) : (
              <ArrowRightFromLine className="w-6! h-6!" />
            )
          }
          title="Export"
          variant={"default"}
          className="bg-brand-primary p-8 text-xl hover:bg-brand-hover cursor-pointer w-full disabled:bg-brand-disabled"
          onClick={onExport}
          disabled={isExporting}
        />
      </div>
    </div>
  )
}
