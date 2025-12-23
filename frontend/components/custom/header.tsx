"use-client"

import Link from "next/link"
import { Button } from "../ui/button"

export default function Header() {
  return (
    <nav className="flex justify-between items-center p-4 border-surface-tertiary border-b-2">
      <Link href={"/"} className="text-2xl">
        {"Pixiflow"}
      </Link>
      <div className="flex gap-2">
        <Button
          variant={"outline"}
          className="border-surface-tertiary border-2 hover:bg-surface-secondary cursor-pointer"
        >
          {"Login"}
        </Button>
        <Button
          variant={"default"}
          className="bg-brand-primary hover:bg-brand-hover cursor-pointer"
        >
          {"Signup"}
        </Button>
      </div>
    </nav>
  )
}
