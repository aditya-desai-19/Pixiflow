import { Button } from "@/components/ui/button"
import { ButtonProps } from "./types"

export default function SecondaryButton({ onClick, title }: ButtonProps) {
  return (
    <Button
      variant={"outline"}
      className="border-surface-tertiary border-2 hover:bg-surface-secondary cursor-pointer w-full"
      onClick={onClick}
    >
      {title}
    </Button>
  )
}
