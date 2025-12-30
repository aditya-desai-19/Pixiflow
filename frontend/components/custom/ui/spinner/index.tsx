import { LoaderCircle, LucideProps } from "lucide-react"

export default function Spinner(props: LucideProps) {
  return (
    <LoaderCircle
      {...props}
      className={`h-4 w-4 animate-spin text-muted-foreground ${props.className}`}
    />
  )
}
