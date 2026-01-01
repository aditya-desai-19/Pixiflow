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

export interface PercentageContainerProps {
  percentage: number
  onPercentChange: (num: number) => void
}

export interface CloseButtonProps {
  onClose: () => void
  tooltipMessage: string
}
