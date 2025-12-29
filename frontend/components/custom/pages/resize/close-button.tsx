import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TooltipArrow } from "@radix-ui/react-tooltip"
import { X } from "lucide-react"
import { CloseButtonProps } from "./types"

export default function CloseButton({
  onClose,
  tooltipMessage,
}: CloseButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="cursor-pointer flex justify-center items-center rounded-full p-1 bg-gray-200"
          onClick={onClose}
        >
          <X className="w-2.5 h-2.5" />
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-black p-2 rounded-lg">
        <p className="text-sm text-surface-primary">{tooltipMessage}</p>
        <TooltipArrow className="fill-black" />
      </TooltipContent>
    </Tooltip>
  )
}
