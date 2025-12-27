import { create } from "zustand"

const initialState = {
  file: null as File | null,
  previewUrl: null as string | null,
  height: 0,
  width: 0,
  aspectRatio: 0,
  changedHeight: 0,
  changedWidth: 0,
}

type ImageStore = typeof initialState & {
  setImage: (file: File) => void
  clearImage: () => void
  setChangedDimensions: (width: number, height: number) => void
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
    set({ file, previewUrl: URL.createObjectURL(file), ...meta })
  },
  clearImage: () => set(initialState),
  setChangedDimensions: (width, height) =>
    set({ changedWidth: width, changedHeight: height }),
}))
