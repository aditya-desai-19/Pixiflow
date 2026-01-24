"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CropMenu() {
  return (
    <div className="flex flex-col px-2 py-1 gap-2">
      <h3 className="text-lg font-semibold">Crop Rectangle</h3>
      <div className="flex gap-2 py-4">
        <Field>
          <FieldLabel htmlFor="width">Width</FieldLabel>
          <Input id="width" type="number" min={0} />
        </Field>
        <Field>
          <FieldLabel htmlFor="height">Height</FieldLabel>
          <Input id="height" type="number" min={0} />
        </Field>
      </div>
      <Field>
        <FieldLabel>Aspect Ratio</FieldLabel>
        <Select defaultValue="freeform">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="freeform">Freeform</SelectItem>
            <SelectItem value="square">{"Square (1:1)"}</SelectItem>
            <SelectItem value="presentation">
              {"Presentation (16:9)"}
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  )
}
