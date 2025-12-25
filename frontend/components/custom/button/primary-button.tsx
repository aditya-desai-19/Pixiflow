import { Button } from "@/components/ui/button"
import { ButtonProps } from "./types"

export default function PrimaryButton(props: ButtonProps) {
  return (
    <Button
      variant={"default"}
      className="bg-brand-primary hover:bg-brand-hover cursor-pointer w-full"
      {...props}
    >
      {props.title}
    </Button>
  )
}
