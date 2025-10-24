declare module 'react-rating-stars-component' {
  import { Component } from 'react'

  export interface ReactStarsProps {
    count?: number
    value?: number
    onChange?: (newRating: number) => void
    size?: number
    activeColor?: string
    color?: string
    isHalf?: boolean
    edit?: boolean
    char?: string
    classNames?: string
    a11y?: boolean
    emptyIcon?: React.ReactElement
    filledIcon?: React.ReactElement
    halfIcon?: React.ReactElement
  }

  export default class ReactStars extends Component<ReactStarsProps> {}
}
