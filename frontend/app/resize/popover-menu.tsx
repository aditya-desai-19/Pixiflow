import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import ResizeSettings from "./resize-settings"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function PopoverMenu() {
  const [open, setOpen] = useState<boolean>(true)

  const onClose = () => setOpen(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="p-4 cursor-pointer">{"Resize Settings"}</Button>
      </PopoverTrigger>
      <PopoverContent className="data-[state=open]:slide-in-from-bottom-20 data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 duration-400 w-100 md:w-150 lg:hidden">
        <ResizeSettings onClose={onClose} />
      </PopoverContent>
    </Popover>
  )
}
