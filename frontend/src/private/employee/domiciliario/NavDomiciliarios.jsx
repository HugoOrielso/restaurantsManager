import React from 'react'
import { NavLink } from 'react-router-dom'
import '/public/css/navDomis.css'
import io from 'socket.io-client'

const NavDomiciliarios = () => {
    const socket  = io("/")
    const user = JSON.parse(localStorage.getItem("domiciliario"))
    function cerrarSesion(){
        socket.emit("actualizarConection", user.nombre)
        localStorage.clear()
        location.reload()
    }
    return (
        <>
            <nav className='navDomi'>
                <ul>
                    <li>
                        <NavLink to="/inicioDomiciliarios">Inicio</NavLink>
                    </li>
                    <li>
                        <NavLink to="/misDomicilios">Mis domicilios</NavLink>
                    </li>
                </ul>
                <button onPointerDown={cerrarSesion} className='buton-cerrar-sesion'>
                    Cerrar sesión
                </button>
            </nav>
        </>
    )
}

export default NavDomiciliarios