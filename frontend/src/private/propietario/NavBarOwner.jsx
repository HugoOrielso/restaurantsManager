import React from 'react'
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import {  deepPurple } from '@mui/material/colors';

const NavBarOwner = () => {
    function cerrarSesion (){
        localStorage.clear()
        setTimeout(()=>{
            location.reload()
        },1000)
      }
  return (
    <div className='nav-bar-owner '>
        <div className='container-logo-nav'>
            <div className='container-img'>
            </div>
            <div>
                <h4 className='p-principal-nav' style={{width:"200px"}}>Pizzería venecia</h4>
            </div>
        </div>
        <div className='box-right-data'>
            <div className='name-box'>
                <div className='container-name'>
                    <p>Administración</p>
                </div>
                <div className='container-name'>
                    <Stack direction="row" spacing={1}>
                        <Avatar sx={{ bgcolor: deepPurple[500] }}>A</Avatar>
                    </Stack>
                </div>
            </div>
            <button className='buton-cerrar-sesion' onPointerDown={cerrarSesion}>Cerrar sesión</button>
        </div>
    </div>
  )
}

export default NavBarOwner