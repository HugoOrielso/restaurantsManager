import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const CocineroProteccion = ({activate , redirethPath="/"}) => {
    if(!activate){
        return <Navigate to={redirethPath} replace/>
    }
    if(activate.subRol == 1){
        return <Outlet/>
    }
}

export default CocineroProteccion