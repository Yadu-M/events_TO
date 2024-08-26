import { Button } from './Button'
import './style.css'
import { ButtonType } from './types'

export const Header = () => {
  return (
    <header>
      <h3>Events and Festivals</h3>
      <div className="header-container">        
        <Button text='Home' type={ButtonType.HEADER}/>        
        <Button text='About' type={ButtonType.HEADER}/>        
        {/* <Button text='About' type={ButtonType.HEADER}/> */}
      </div>
    </header>
  )
}
