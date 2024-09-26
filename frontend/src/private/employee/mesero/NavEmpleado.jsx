import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../../../public/css/navMesero.css'
import io from 'socket.io-client'
const NavEmpleado = () => {
  const socket = io("/")
  const user = JSON.parse(localStorage.getItem("mesero"))
  function cerrarSesion (){
    socket.emit("actualizarConection", user.nombre)
    localStorage.clear()
    setTimeout(()=>{
        location.reload()
    },1000)
  }
  return (
    <>
      <nav className='nav-empleado'>
          <ul className='ul-empleado'>
              <li className='li-empleado'>
                  <NavLink to="/inicioMesero" className="a-empleado">Inicio</NavLink>
              </li>
          </ul>
          <button className='buton-cerrar-sesion' onPointerDown={cerrarSesion}>Cerrar sesión</button>
      </nav>
    </>
  )
}

export default NavEmpleado