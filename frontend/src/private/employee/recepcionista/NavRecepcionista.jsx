/* eslint-disable react/react-in-jsx-scope */
import { NavLink } from 'react-router-dom'
import '/public/css/navRecepcionistas.css'
const NavRecepcionista = () => {
    function cerrarSesion (){
        localStorage.clear()
        setTimeout(()=>{
            location.reload()
        },1000)
    }
    return (
        <nav className='nav-recepcionista noPrint'>
            <ul className='ul-recepcionista'>
                <li className='li-recepcionista'>
                    <NavLink to="/inicioRecepcionistas" className="a-recepcionista">Inicio</NavLink>
                </li>
                <li className='li-recepcionista'>
                    <NavLink to="/pedidosEnCurso" className="a-recepcionista">Pedidos en curso</NavLink>
                </li>
                <li className='li-recepcionista'>
                    <NavLink to="/reporte" className="a-recepcionista">Reporte del día</NavLink>
                </li>
                <li className='li-recepcionista'>
                    <NavLink to="/reporteDomicilios" className="a-recepcionista">Reporte domicilios</NavLink>
                </li>
            </ul>
            <button className='buton-cerrar-sesion' onPointerDown={cerrarSesion}>Cerrar sesión</button>
        </nav>
    )
}

export default NavRecepcionista