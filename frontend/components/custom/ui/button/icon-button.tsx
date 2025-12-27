import { Button } from "@/components/ui/button"
import { IconButtonProps } from "./types"

export default function IconButton(props: IconButtonProps) {
  return (
    <Button {...props} className={`w-full ${props.className}`}>
      <span>{props.icon}</span>
      {props.title}
    </Button>
  )
}
