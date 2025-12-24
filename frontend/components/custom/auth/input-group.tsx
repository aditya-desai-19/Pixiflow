import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HTMLInputTypeAttribute } from "react"

export interface InputGroupProps {
  isRequired: boolean
  label: string
  inputType: HTMLInputTypeAttribute
  inputId: string
  inputPlaceholder: string
  isError: boolean
  errorMessage: string
}

export default function InputGroup({
  isRequired,
  label,
  inputType,
  inputId,
  inputPlaceholder,
  isError,
  errorMessage,
}: InputGroupProps) {
  return (
    <div className="flex flex-col gap-2 my-2">
      <Label htmlFor={inputId} className="gap-0">
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type={inputType}
        placeholder={inputPlaceholder}
        id={inputId}
        className="focus-visible:ring-brand-primary focus-visible:ring-1"
      />
      {isError && <span className="text-red-500 text-xs">{errorMessage}</span>}
    </div>
  )
}
