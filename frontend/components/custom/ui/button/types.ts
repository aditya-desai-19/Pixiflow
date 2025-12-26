import { ReactNode } from "react"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

export interface ButtonProps extends Props {
  title: string
}

type ButtonVariant =
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined

export interface IconButtonProps extends Props {
  icon: ReactNode
  title: string
  variant: ButtonVariant
}
