"use client"

import { authClient } from "@/api/client"
import InputGroup, {
  InputGroupProps,
} from "@/components/custom/auth/input-group"
import { PrimaryButton } from "@/components/custom/button"
import { RegisterUserRequest } from "@/generated"
import { FormEvent, useState } from "react"

export default function SignUp() {
  const [nameError, setNameError] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [confirmPasswordError, setConfirmPassword] = useState<string>("")

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string

    let isValid = true
    if (!name) {
      isValid = false
      setNameError("Field can't be empty")
    }

    if (!email) {
      isValid = false
      setEmailError("Field can't be empty")
    }

    if (!password) {
      isValid = false
      setPasswordError("Field can't be empty")
    }

    if (!confirmPassword) {
      isValid = false
      setConfirmPassword("Field can't be empty")
    }

    if (password !== confirmPassword) {
      isValid = false
      setConfirmPassword("Field should match with password")
    }

    if (!isValid) return

    try {
      const body: RegisterUserRequest = {
        registerRequest: {
          email,
          name,
          password,
        },
      }
      const res = await authClient.registerUser(body)
    } catch (e) {
      console.error("Some error occured while signing up ", e)
    }
  }

  const inputItems: InputGroupProps[] = [
    {
      label: "Name",
      id: "name",
      placeholder: "Name",
      isRequired: true,
      type: "text",
      name: "name",
      isError: nameError.length > 0,
      errorMessage: nameError,
    },
    {
      label: "Email",
      id: "email",
      placeholder: "Email",
      isRequired: true,
      type: "email",
      name: "email",
      isError: emailError.length > 0,
      errorMessage: emailError,
    },
    {
      label: "Password",
      id: "password",
      placeholder: "Password",
      isRequired: true,
      type: "password",
      name: "password",
      isError: passwordError.length > 0,
      errorMessage: passwordError,
    },
    {
      label: "Confirm Password",
      id: "confirm-password",
      placeholder: "Confirm Password",
      isRequired: true,
      type: "password",
      name: "confirm-password",
      isError: confirmPasswordError.length > 0,
      errorMessage: confirmPasswordError,
    },
  ]

  return (
    <div className="flex-1 flex h-screen justify-center items-center">
      <div className="flex flex-col gap-3 border-2 p-6 shadow-lg rounded-lg w-1/4">
        <h1 className="text-2xl text-center font-semibold">{"Signup"}</h1>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
          {inputItems.map((inp, i) => (
            <InputGroup key={i} {...inp} />
          ))}

          <div className="my-2 w-full">
            <PrimaryButton onClick={() => {}} title="Signup" type="submit" />
          </div>
        </form>
      </div>
    </div>
  )
}
