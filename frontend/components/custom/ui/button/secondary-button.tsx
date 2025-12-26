import { Button } from "@/components/ui/button"
import { ButtonProps } from "./types"

export default function SecondaryButton(props: ButtonProps) {
  return (
    <Button
      variant={"outline"}
      className="border-surface-tertiary border-2 hover:bg-surface-secondary cursor-pointer w-full"
      {...props}
    >
      {props.title}
    </Button>
  )
}
