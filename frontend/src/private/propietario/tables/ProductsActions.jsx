/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Delete, Edit } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';
import { Global } from '../../../helpers/Helpers';
import '/public/css/transitionView.css'
import { customAxios } from '../../../../interceptors/axios.interceptor';
import { toast } from 'sonner';

const ProductsActions = ({params}) => {
    async function eliminarProductoDB(){
        const request = await customAxios.delete(Global.url + 'propietario/producto/' + params.row.producto_id,{
            headers: {
                "content-type":"application/json",
            },
            withCredentials: true
        })
        if(request.data.status=="success"){
            toast.info("Producto eliminado correctamente")
            setTimeout(()=>{
                location.reload()
            },2000)
        }
    }

    function updateDom(target){
    }
    const viewTransition = (e)=>{
        document.startViewTransition(()=>updateDom(e.target))
    }
  return (
    <Box>
        <Tooltip title={`Editar producto ${params.row.nombre}`}>
            <Link to={`/administracion/editarProducto/${params.row.producto_id}`} onClick={viewTransition}>
                <IconButton >
                    <Edit sx={{fill: "blue"}}/>
                </IconButton>
            </Link>
        </Tooltip>
        <Tooltip title={`Eliminar producto ${params.row.nombre}`}>
            <IconButton onPointerDown={eliminarProductoDB}>
                <Delete sx={{fill: "red"}}/>
            </IconButton>
        </Tooltip>

    </Box>
  )
}

export default ProductsActions