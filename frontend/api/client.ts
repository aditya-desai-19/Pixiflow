import { AuthApi, BaseAPI, Configuration, ImagesApi } from "../generated"

const baseConfig = new Configuration({
  basePath: process.env.BACKEND_URL,
})

export const authClient = new AuthApi(baseConfig)
export const imagesClient = new ImagesApi(baseConfig)
