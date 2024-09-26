import React from 'react'

const CerrarSesion = () => {
    async function cerrarSesion (){
        localStorage.clear()
        location.reload()
    }
  return (
    <button onPointerDown={cerrarSesion} className='boton-cerrar-sesion'>Cerrar sesión</button>
  )
}

export default CerrarSesion