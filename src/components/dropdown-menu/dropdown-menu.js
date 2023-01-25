import React, { useState, useRef } from 'react';
import uniqid from "uniqid";


const DropdownMenu = ({className, buttonClass, menuClass, rates, onRatesClick, buttonText}) => {

  const toggleButtonRef = useRef(null)
  const dropdownWrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonId = uniqid("menu-");
  const dropdownId = uniqid("dropdown-");
  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    const focusElement = isOpen ?  toggleButtonRef.current : dropdownWrapperRef.current.querySelector('button')

    requestAnimationFrame(() => focusElement.focus())
  }

  
  const onOptionClicked = (rate) => {
    setIsOpen(false)
    onRatesClick(rate)
  }

  const escKey = 'Escape'
  const upKey = 'ArrowUp'
  const downKey = 'ArrowDown'
  const tabKey = 'Tab'



  const onOptionKeydown = (e, i) => {
    const optionsNodeList = dropdownWrapperRef.current.querySelectorAll('button');
    switch (e.key) {
      case upKey:
        if(i === 0) {
          optionsNodeList[optionsNodeList.length - 1].focus()
        } else {
          optionsNodeList[i - 1].focus()
        }
        break;
      case tabKey: 
       setIsOpen(false)
       break
      case downKey:
        if(i === optionsNodeList.length - 1) {
          optionsNodeList[0].focus()
        } else {
          optionsNodeList[i + 1].focus()
        }
        break
      case escKey: 
       setIsOpen(false)
       toggleButtonRef.current.focus();
       break
      default:
        break;
    } 
  }


  return (
    <>
      <div className={className}>
        <button 
          ref={toggleButtonRef} 
          className={buttonClass} 
          onClick={toggleMenu}
          aria-haspopup="true"
          aria-expanded={isOpen ? "true" : undefined}
          aria-controls={dropdownId}/*  this element controls the element with this id */
          id={menuButtonId}
        >
          {buttonText}
        </button>
        <div 
          ref={dropdownWrapperRef} 
          aria-labelledby={menuButtonId}
          role='menu'
          id={dropdownId}
          className={isOpen ? `${menuClass} open` : menuClass }
        >
          {rates.map((rate, i) => (
            <button 
              key={i} 
              role="menuitem"
              tabIndex={-1}
              onClick={() => onOptionClicked(rate)}
              onKeyDown={(e) => onOptionKeydown(e, i)}
              >
                {rate}x
            </button>
            ))}
        </div>
      </div>
    </>
  )
  // Create a state to open and close menu
  // need to be able to send focus to various places
  //a. to button upon close
  //b. to other menu items upon arrow keys
  //c. navigate focus in menu through arrow keys not TAB
}

export default DropdownMenu