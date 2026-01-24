import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface ImageModificationButton {
  icon: React.ReactNode
  tooltipMessage: string
  onClick: () => void
}

interface ImageModificationIconsProps {
  buttons: Array<ImageModificationButton>
}

export default function ImageModificationButtons({
  buttons,
}: ImageModificationIconsProps) {
  return (
    <div className="flex justify-end gap-2 p-2 bg-gray-100">
      {buttons.map((button, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <Button variant={"outline"} size={"icon"} onClick={button.onClick}>
              {button.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{button.tooltipMessage}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
