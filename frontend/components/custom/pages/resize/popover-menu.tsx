import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PrimaryButton } from "../../ui/button"
import ResizeSettings from "./resize-settings"
import { useState } from "react"

export default function PopoverMenu() {
  const [open, setOpen] = useState<boolean>(true)

  const onClose = () => setOpen(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PrimaryButton title="Resize Settings" className="p-4" />
      </PopoverTrigger>
      <PopoverContent className="data-[state=open]:slide-in-from-bottom-20 data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 duration-400 w-100 md:w-150 lg:hidden">
        <ResizeSettings onClose={onClose} />
      </PopoverContent>
    </Popover>
  )
}
