import React from 'react'
import { NavLink } from 'react-router-dom'
import { Balance, Box, Gastos, Ingresos, Users } from './IconsNav'
import AlignVerticalCenterIcon from '@mui/icons-material/AlignVerticalCenter';
import DescriptionIcon from '@mui/icons-material/Description';
import '/public/css/AsideOwner.css'
const AsideOwner = () => {
  return (
    <aside className='aside-owner'>
      <div className='container-ul-aside'>
        <ul className='ul-aside-owner'>
          <li className='li-aside-owner'>
            <NavLink className="a-aside-owner" to="/administracion/inicio"> <AlignVerticalCenterIcon/> Inicio</NavLink>
          </li>
          <li className='li-aside-owner'>
            <NavLink className="a-aside-owner" to="/administracion/ingresos">  <Ingresos/> Ingresos </NavLink>
          </li>
          <li className='li-aside-owner'>
            <NavLink className="a-aside-owner" to="/administracion/gastos"> <Gastos/> Gastos  </NavLink>
          </li>
          <li className='li-aside-owner'>
            <NavLink className="a-aside-owner" to="/administracion/balance">  <Balance/>  Balance </NavLink>
          </li>
          <li className='li-aside-owner'>
            <NavLink className="a-aside-owner" to="/administracion/inventario"> <Box/> Inventario  </NavLink>
          </li>
          <li className='li-aside-owner'>
            <NavLink className="a-aside-owner" to="/administracion/empleado"> <Users/>  Empleados</NavLink>
          </li>
          <li className='li-aside-owner'>
            <NavLink className="a-aside-owner" to="/administracion/pedidosEnCurso"><DescriptionIcon style={{fill: "orange"}}/> Pedidos en curso</NavLink>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default AsideOwner