import { ButtonType } from "./types"
import './style.css'

export const Button  = ({ text, type }: { text: string, type: ButtonType }) => {

  let className = "btn"

  switch (type) {
    case ButtonType.HEADER:
      className += " "
      break
  }

  return (
    <button className={className}>{text}</button>
  )
}

