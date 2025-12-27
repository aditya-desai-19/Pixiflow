import { HTMLInputTypeAttribute } from "react"

export interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  isRequired?: boolean
  isError?: boolean
  errorMessage?: string
  type?: HTMLInputTypeAttribute
}

export interface AuthHandlerProps {
  token: string | undefined;
}