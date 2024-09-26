import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const DomiciliarioProteccion = ({activate}) => {
  
    if(!activate){
        return <Navigate to="/"/>
    }

    if(activate.subRol == 4){
        return <Outlet/>
    }

}

export default DomiciliarioProteccion