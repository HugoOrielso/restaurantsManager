import React from 'react'
export const Fecha = () => {
    const fechaActual = new Date()
    const year = fechaActual.getFullYear()
    const month = fechaActual.getMonth() + 1
    const day = fechaActual.getDate()
  return (
    <>
      {`${year}/${month}/${day}`}
    </>
  )
}
