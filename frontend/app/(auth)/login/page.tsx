"use client"

import { authClient } from "@/api/client"
import InputGroup, {
  InputGroupProps,
} from "@/components/custom/auth/input-group"
import { PrimaryButton } from "@/components/custom/button"
import { LoginUserRequest } from "@/generated"
import { useAuthStore } from "@/zustand/authStore"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"

export default function Login() {
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")

  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const { setIsLoggedIn } = useAuthStore()

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

      await authClient.loginUser(body)
      formRef?.current?.reset()
      router.replace("/")
      setIsLoggedIn(true)
    } catch (e) {
      console.error("Some error occured while login ", e)
    }
  }

  const inputItems: InputGroupProps[] = [
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
