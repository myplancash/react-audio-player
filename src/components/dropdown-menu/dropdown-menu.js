import React, { useState, useRef } from 'react';

const DropdownMenu = ({className, buttonClass, menuClass, rates, onRatesClick, buttonText}) => {
  // Create a state to open and close menu
  // need to be able to send focus to various places
  //a. to button upon close
  //b. to other menu items upon arrow keys
  //c. navigate focus in menu through arrow keys not TAB
  const buttonToggleRef = useRef(null)
  const dropdownWrapperRef = useRef(null)
  const [ isOpen, setIsOpen ] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  const handleRateClick = (rate) => {
    onRatesClick(rate)
  }

  return (
    <div className={className}>
      <button 
        ref={buttonToggleRef} 
        onClick={toggleMenu}
        className={buttonClass}
      >
        {buttonText}
      </button>
      <div ref={dropdownWrapperRef} className={isOpen ? `${menuClass} open` : menuClass}>
        {rates.map((rate, i) => (
          <button 
            key={i} 
            tabIndex={-1}
            onClick={() => handleRateClick(rate)}
            onKeyDown={() => {}}  
          >
            {rate}x
          </button>
        ))}
      </div>
    </div>
  )
}

export default DropdownMenu