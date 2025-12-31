import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/custom/ui/header"
import { cookies } from "next/headers"
import AuthHandler from "@/components/custom/pages/auth/auth-handler"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Pixiflow",
  description: "Alternative to imageresizer.com",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("access_token")?.value

  return (
    <html lang="en" className={inter.className}>
      <body className="overflow-auto">
        <div className="flex flex-col h-screen lg:mx-10">
          <AuthHandler token={accessToken} />
          <Header />
          <main>{children}</main>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
