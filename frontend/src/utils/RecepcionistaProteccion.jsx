import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const RecepcionistaProteccion = ({activate , redirethPath = "/"}) => {

    if(!activate){
        return <Navigate to={redirethPath} replace/>
    }

    if(activate.subRol == 3){
        return <Outlet/>
    }

}

export default RecepcionistaProteccion