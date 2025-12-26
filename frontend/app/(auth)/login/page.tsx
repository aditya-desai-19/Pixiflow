"use client"

import { authClient, userClient } from "@/api/client"
import InputGroup, {
  InputGroupProps,
} from "@/components/custom/pages/auth/input-group"
import { IconButton } from "@/components/custom/ui/button"
import Spinner from "@/components/custom/ui/spinner"
import { LoginUserRequest } from "@/generated"
import { useAuthStore } from "@/zustand/authStore"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"

export default function Login() {
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)

  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const { setIsLoggedIn, setUserEmail, setUserName } = useAuthStore()

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

    setIsLoggingIn(true)
    try {
      const body: LoginUserRequest = {
        loginRequest: {
          email,
          password,
        },
      }

      await authClient.loginUser(body)

      const user = await userClient.getUser()
      setUserName(user.name)
      setUserEmail(user.email)
      setIsLoggedIn(true)

      formRef?.current?.reset()
      router.replace("/")
    } catch (e) {
      console.error("Some error occured while login ", e)
    } finally {
      setIsLoggingIn(false)
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
            <IconButton
              variant={"default"}
              icon={
                isLoggingIn ? (
                  <Spinner className="text-surface-primary animate-spin" />
                ) : null
              }
              title="Login"
              className="bg-brand-primary hover:bg-brand-hover cursor-pointer w-full disabled:bg-brand-disabled"
              disabled={isLoggingIn}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
