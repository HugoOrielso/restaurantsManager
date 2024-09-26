import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const MeseroProteccion = ({activate}) => {
    if(!activate){
        return <Navigate to="/" replace/>
    }
    if(activate.subRol == 2){
        return <Outlet/>
    }
}

export default MeseroProteccion