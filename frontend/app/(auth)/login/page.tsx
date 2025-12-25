"use client"

import { authClient } from "@/api/client"
import InputGroup, {
  InputGroupProps,
} from "@/components/custom/auth/input-group"
import { PrimaryButton } from "@/components/custom/button"
import { LoginUserRequest } from "@/generated"
import { FormEvent, useState } from "react"

export default function Login() {
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    let isValid = true
    if (!email) {
      isValid = false
      setEmailError("Field can't be empty")
    }

    if (!password) {
      isValid = false
      setPasswordError("Field can't be empty")
    }

    if (!isValid) return

    try {
      const body: LoginUserRequest = {
        loginRequest: {
          email,
          password,
        },
      }
      const res = await authClient.loginUser(body)
    } catch (e) {
      console.error("Some error occured while signing up ", e)
    }
  }

  const inputItems: InputGroupProps[] = [
    {
      label: "Email",
      id: "email",
      placeholder: "Email",
      isRequired: true,
      type: "email",
      isError: emailError.length > 0,
      errorMessage: emailError,
    },
    {
      label: "Password",
      id: "password",
      placeholder: "Password",
      isRequired: true,
      type: "password",
      isError: passwordError.length > 0,
      errorMessage: passwordError,
    },
  ]

  return (
    <div className="flex-1 flex h-screen justify-center items-center">
      <div className="flex flex-col gap-3 border-2 p-6 shadow-lg rounded-lg w-1/4">
        <h1 className="text-2xl text-center font-semibold">{"Login"}</h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          {inputItems.map((inp, i) => (
            <InputGroup key={i} {...inp} />
          ))}

          <div className="my-2 w-full">
            <PrimaryButton onClick={() => {}} title="Login" type="submit" />
          </div>
        </form>
      </div>
    </div>
  )
}
