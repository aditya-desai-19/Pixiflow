"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AspectRatio } from "./types"
import { PixelCrop } from "react-image-crop"

interface CropMenuProps {
  originalHeight: number
  originalWidth: number
  croppedWidth: number
  croppedHeight: number
  aspectRatio: AspectRatio
  onCroppedWidthChange: (value: number) => void
  onCroppedHeightChange: (value: number) => void
  onAspectRatioChange: (value: AspectRatio) => void
  completedCrop: PixelCrop | undefined
  onCropClick: () => void
}

export default function CropMenu({
  originalHeight,
  originalWidth,
  croppedWidth,
  croppedHeight,
  aspectRatio,
  completedCrop,
  onCroppedWidthChange,
  onCroppedHeightChange,
  onAspectRatioChange,
  onCropClick,
}: CropMenuProps) {

  const onValueChange = (value: AspectRatio) => {
    onAspectRatioChange(value)
    let ratio;
    if(value === AspectRatio.Square) {
      ratio = 1;
    } else if(value === AspectRatio.Presentation) {
      ratio = 16 / 9;
    } else {
      return;
    }
    const newHeight = Math.round(croppedWidth / ratio);
    if(newHeight <= originalHeight) {
      onCroppedHeightChange(newHeight);
    } else {
      const newWidth = Math.round(croppedHeight * ratio);
      onCroppedWidthChange(newWidth);
    }
  }

  const onWidthChange = (value: number) => {
    
    let ratio;
    if(aspectRatio === AspectRatio.Square) {
      ratio = 1;
    } else if(aspectRatio === AspectRatio.Presentation) {
      ratio = 16 / 9;
    } else {
      onCroppedWidthChange(value);
      return;
    }
    const newHeight = Math.round(value / ratio);
    if(newHeight <= originalHeight) {
      onCroppedWidthChange(value);
      onCroppedHeightChange(newHeight);
    }
  }

  const onHeightChange = (value: number) => {
    let ratio;
    if(aspectRatio === AspectRatio.Square) {
      ratio = 1;
    } else if(aspectRatio === AspectRatio.Presentation) {
      ratio = 16 / 9;
    } else {
      onCroppedHeightChange(value);
      return;
    }
    const newWidth = Math.round(value / ratio);
    if(newWidth <= originalWidth) {
      onCroppedHeightChange(value);
      onCroppedWidthChange(newWidth);
    }
  }

  return (
    <div className="flex flex-col px-2 py-1 gap-2">
      <h3 className="text-lg font-semibold">Crop Rectangle</h3>
      <div className="flex gap-2 py-4">
        <Field>
          <FieldLabel htmlFor="width">Width</FieldLabel>
          <Input
            id="width"
            type="number"
            min={0}
            max={originalWidth}
            value={croppedWidth}
            onChange={(e) => onWidthChange(Number(Math.min(originalWidth, Number(e.target.value))))}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="height">Height</FieldLabel>
          <Input
            id="height"
            type="number"
            min={0}
            max={originalHeight}
            value={croppedHeight}
            onChange={(e) => onHeightChange(Number(Math.min(originalHeight, Number(e.target.value))))}
          />
        </Field>
      </div>
      <Field>
        <FieldLabel>Aspect Ratio</FieldLabel>
        <Select defaultValue={aspectRatio} onValueChange={onValueChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select aspect ratio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AspectRatio.Freeform}>Freeform</SelectItem>
            <SelectItem value={AspectRatio.Square}>{"Square (1:1)"}</SelectItem>
            <SelectItem value={AspectRatio.Presentation}>
              {"Presentation (16:9)"}
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <div className="flex justify-center py-4">
        <Button className="px-16 py-4" onClick={onCropClick} disabled={!completedCrop || completedCrop.width <= 0 || completedCrop.height <= 0}>Crop</Button>
      </div>
    </div>
  )
}
