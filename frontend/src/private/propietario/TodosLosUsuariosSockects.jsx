import React, { useEffect, useState } from 'react'
import { User } from './IconsNav'
import io from 'socket.io-client'
import '/public/css/toggle.css'

const TodosLosUsuariosSockects = ({allUsers}) => {
  const [sesiones,setSesiones]= useState([])
  const socket = io("/")
  socket.on("login", (data)=>{
      console.log(data);
      setSesiones(data)
  })
  socket.on("actualizarConection",(data)=>{
  })

  useEffect(()=>{

  },[sesiones])
  return (
    <>
      <header className='header-users'>
        <p>Usuario</p>
        <p>Conectado</p>
      </header>
      {allUsers.map((user,i)=>{
                const sesionUsuario = sesiones.find((sesion) => sesion.nombre === user.name);

        return(
          <div className='item-user-list' key={i}>
            <div className='user'>
              <User/>
              <div className='user-texts'>
                <span className='user-name'>{user.name}</span>
                <span className='user-email'>{user.email }</span>
              </div>
                
              <div>
              </div>
            </div>
          </div>
        )
      })}    
    </>
  )
}

export default TodosLosUsuariosSockects