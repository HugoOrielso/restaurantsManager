/* eslint-disable react/prop-types */
import React from 'react'
import { Navigate , Outlet } from 'react-router-dom'
const PropietarioProteccion = ({activate , redirectPath="/"}) => {
  if(!activate){
    return(
        <Navigate to={redirectPath} replace/>
    )
  }else{
    if(activate.rol == 2){
        return <Outlet/>
    }
  }
}

export default PropietarioProteccion