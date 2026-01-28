"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import SizeContainer from "./size-container"
import { useEffect, useState } from "react"
import { ArrowRightFromLine } from "lucide-react"
import { Format } from "./types"
import { useImageStore } from "@/zustand/image-store"
import { imagesClient } from "@/api/client"
import { UploadImageRequest } from "@/generated"
import PercentageContainer from "./percentage-container"
import CloseButton from "./close-button"
import { downloadImage } from "@/utils/download-image"
import { toast } from "sonner"
import { IconButton } from "@/components/custom/ui/button"
import Spinner from "@/components/custom/ui/spinner"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ResizeSettingsProps {
  onClose?: () => void
}

enum ImageFormat {
  Jpeg = "image/jpg",
  Png = "image/png",
  Webp = "image/webp",
}

export default function ResizeSettings({ onClose }: ResizeSettingsProps) {
  const [formatType, setFormatType] = useState<Format>(Format.Size)
  const [imageFormat, setImageFormat] = useState<ImageFormat>(ImageFormat.Jpeg)

  const {
    file,
    aspectRatio,
    height: originalHeight,
    width: originalWidth,
    changedHeight: height,
    changedWidth: width,
    setChangedDimensions,
    clearImage,
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
        fileType: imageFormat,
      }
      const res = await imagesClient.uploadImage(body)
      await downloadImage(res.imageUrl, res.imageName)
      clearImage()
    } catch (e) {
      console.error("Error exporting image:", e)
      toast.error("Some error occured while exporting image", {
        className: "text-white! bg-red-500!",
        position: "bottom-left",
      })
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

  useEffect(() => {
    if (!file) return
    const imageType = file.type
    if (
      imageType === ImageFormat.Jpeg ||
      imageType === ImageFormat.Png ||
      imageType === ImageFormat.Webp
    ) {
      setImageFormat(imageType as ImageFormat)
    }
  }, [file])

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
        className="w-full grid grid-cols-2 mt-8 mb-4 border-2"
        value={formatType}
        onValueChange={onFormatChange}
      >
        <ToggleGroupItem
          value="size"
          className="w-full data-[state=on]:bg-secondary"
        >
          {"By size"}
        </ToggleGroupItem>

        <ToggleGroupItem
          value="percentage"
          className="w-full data-[state=on]:bg-secondary"
        >
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

      <Field>
        <FieldLabel>Save Image as</FieldLabel>
        <Select
          defaultValue={ImageFormat.Jpeg}
          value={imageFormat}
          onValueChange={(value) => setImageFormat(value as ImageFormat)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select image format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ImageFormat.Jpeg}>JPG</SelectItem>
            <SelectItem value={ImageFormat.Png}>PNG</SelectItem>
            <SelectItem value={ImageFormat.Webp}>WebP</SelectItem>
          </SelectContent>
        </Select>
      </Field>
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
          className="p-8 text-xl cursor-pointer"
          onClick={onExport}
          disabled={isExporting}
        />
      </div>
    </div>
  )
}
