import { FC, CSSProperties, ReactNode } from 'react'

interface LogoItem {
  src?: string
  srcSet?: string
  sizes?: string
  width?: number
  height?: number
  alt?: string
  title?: string
  href?: string
  node?: ReactNode
  ariaLabel?: string
}

interface LogoLoopProps {
  logos: LogoItem[]
  speed?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  width?: string | number
  logoHeight?: number
  gap?: number
  pauseOnHover?: boolean
  hoverSpeed?: number
  fadeOut?: boolean
  fadeOutColor?: string
  scaleOnHover?: boolean
  renderItem?: (item: LogoItem, key: string) => ReactNode
  ariaLabel?: string
  className?: string
  style?: CSSProperties
}

export const LogoLoop: FC<LogoLoopProps>
export default LogoLoop
