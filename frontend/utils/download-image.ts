export const downloadImage = async (imageUrl: string, imageName: string) => {
  const response = await fetch(imageUrl)
  const blob = await response.blob()

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")

  a.href = url
  a.download = imageName
  document.body.appendChild(a)
  a.click()

  a.remove()
  window.URL.revokeObjectURL(url)
}
