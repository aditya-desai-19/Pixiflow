"use client"

import InputGroup, {
  InputGroupProps,
} from "@/components/custom/auth/input-group"
import { PrimaryButton } from "@/components/custom/button"

export default function Login() {
  const inputItems: InputGroupProps[] = [
    {
      label: "Email",
      inputId: "email",
      inputPlaceholder: "Email",
      isRequired: true,
      inputType: "email",
      isError: true,
      errorMessage: "Invalid email",
    },
    {
      label: "Password",
      inputId: "password",
      inputPlaceholder: "Password",
      isRequired: true,
      inputType: "password",
      isError: false,
      errorMessage: "",
    },
  ]

  return (
    <div className="flex-1 flex h-screen justify-center items-center">
      <div className="flex flex-col gap-4 border-2 p-6 shadow-lg rounded-lg w-1/4">
        <h1 className="text-2xl text-center font-semibold">{"Login"}</h1>
        
        {inputItems.map((inp, i) => (
          <InputGroup key={i} {...inp} />
        ))}

        <div className="my-2 w-full">
          <PrimaryButton onClick={() => {}} title="Login" />
        </div>
      </div>
    </div>
  )
}
