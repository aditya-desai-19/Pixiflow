export enum Format {
  Size = "size",
  Percentage = "percentage",
}

export interface SizeContainerProps {
  height: number
  width: number
  onLockAspectRatio: () => void
  onHeightChange: (newHeight: number) => void
  onWidthChange: (newWidth: number) => void
}
