import { create } from "zustand"

const initialState = {
  file: null as File | null,
  previewUrl: null as string | null,
  height: 0,
  width: 0,
  aspectRatio: 0,
}

type ImageStore = typeof initialState & {
  setImage: (file: File) => void
  clearImage: () => void
}

export function getImageDimensions(file: File): Promise<{
  width: number
  height: number
  aspectRatio: number
}> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      })
      URL.revokeObjectURL(url)
    }

    img.onerror = reject
    img.src = url
  })
}

export const useImageStore = create<ImageStore>((set) => ({
  ...initialState,
  setImage: async (file) => {
    const meta = await getImageDimensions(file)
    set({ file, ...meta })
  },
  clearImage: () => set(initialState),
}))
