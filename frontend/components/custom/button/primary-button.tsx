import { Button } from "@/components/ui/button"
import { ButtonProps } from "./types"

export default function PrimaryButton({ onClick, title }: ButtonProps) {
  return (
    <Button
      variant={"default"}
      className="bg-brand-primary hover:bg-brand-hover cursor-pointer w-full"
      onClick={onClick}
    >
      {title}
    </Button>
  )
}
