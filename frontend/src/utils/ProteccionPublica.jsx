import React from 'react'
import { Navigate , Outlet } from 'react-router-dom'
const ProteccionPublica = ({activate}) => {
    if(!activate){
        return <Outlet/>
    }else if(activate.rol==1){
        return <Navigate to="/adminInicio" replace/>
    }else if(activate.rol==2){
        return <Navigate to="/administracion/inicio" replace/>
    }else if(activate.subRol==2){
        return <Navigate to="/inicioMesero" replace/>
    }else if(activate.subRol == 3){
        return <Navigate to="/inicioRecepcionistas" replace/>
    }else if(activate.subRol == 1){
        return <Navigate to="/inicioCocineros" replace/>
    }else if(activate.subRol == 4){
        return <Navigate to="/inicioDomiciliarios" replace/>
    }
}

export default ProteccionPublica