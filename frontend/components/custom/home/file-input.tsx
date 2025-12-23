"use client"

import { Button } from "@/components/ui/button"
import { Image } from "lucide-react"
import { ChangeEvent, useRef, useState } from "react"

export default function FileInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  //todo
  const onFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
  }

  return (
    <div className="flex justify-center items-center my-16">
      <div className="bg-brand-primary w-3/4 p-12 flex flex-col justify-center items-center gap-1 text-surface-secondary shadow-md shadow-brand-primary lg:w-1/2">
        <Image size={55} strokeWidth={1} strokeOpacity={1} className="my-2 text-lg" />
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={onFileUpload}
        />
        <Button
          className="bg-surface-primary text-primary text-lg hover:bg-surface-secondary cursor-pointer w-52 p-6 my-1"
          onClick={() => inputRef.current?.click()}
        >
          {"Select image"}
        </Button>
        <p className="text-xs text-primary font-medium">
          {"or, drag and drop image here"}
        </p>
        <p className="text-xs">{"Max file size: 5 mb"}</p>
      </div>
    </div>
  )
}
