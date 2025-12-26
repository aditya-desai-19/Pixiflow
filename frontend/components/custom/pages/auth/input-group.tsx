"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { HTMLInputTypeAttribute, useState } from "react"
import clsx from "clsx"

export interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  isRequired?: boolean
  isError?: boolean
  errorMessage?: string
  type?: HTMLInputTypeAttribute
}

export default function InputGroup({
  label,
  isRequired,
  isError,
  errorMessage,
  type = "text",
  id,
  className,
  ...inputProps
}: InputGroupProps) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === "password"

  return (
    <div className="flex flex-col gap-2 my-2">
      <Label htmlFor={id}>
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </Label>

      <div className="relative">
        <Input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          className={clsx(
            "focus-visible:ring-brand-primary focus-visible:ring-1",
            isPassword && "pr-10",
            isError && "border-red-500",
            className
          )}
          {...inputProps}
        />

        {isPassword && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        )}
      </div>

      {isError && errorMessage && (
        <span className="text-red-500 text-xs">{errorMessage}</span>
      )}
    </div>
  )
}
