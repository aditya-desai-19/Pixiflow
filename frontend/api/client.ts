import { AuthApi, Configuration, ImagesApi } from "../generated"

const baseConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
})

export const authClient = new AuthApi(baseConfig)
export const imagesClient = new ImagesApi(baseConfig)
