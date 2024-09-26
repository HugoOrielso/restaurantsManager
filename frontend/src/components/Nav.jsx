import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../../public/css/nav.css'


const Nav = () => {
    
    const [ desplegar, setDesplegar ] = useState(false)

    const toggleMenu = () =>{
        setDesplegar(!desplegar)
    }

  return (
    <header >
    <nav className='nav '>
        <div className='container-logo-list'>
            <button className='button-logo' onPointerDown={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="list-svg" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
            </button>
        </div>
        <ul className='ul'>
            <li className='li'>
                <NavLink className="a" to="/">< span className='span'>Inicio</span> </NavLink>
            </li>
            <li className='li'>
                <NavLink className="a" to="/empleado"><span className='span'>Empleados</span> </NavLink>
            </li>
        </ul>
    </nav>
    </header>
  )
}

export default Nav