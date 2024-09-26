/* eslint-disable react/prop-types */
import React from 'react'
import imagesGaseosa from '../../../../public/imagenes/gaseosas.jpg'
import imagesPizza from '../../../../public/imagenes/pizza.png'
import imagesHamburguesa from '../../../../public/imagenes/hamburguesa.png'
import imagesPerro from '../../../../public/imagenes/perro.jpg'
const RenderImages = ({params}) => {
  return (
    <div >
        {params.row.categoria == 'Pizzas' && <img src={imagesPizza} alt={params.row.nombre}  className='img-avatar-producto album' style={{viewTransitionName: `producto ${params.row.id} imagen`, renderCell: (params)}} onPointerDown={()=> location.href = "/administracion/editarProducto/" + params.row.producto_id} data-name={`producto ${params.row.id} imagen`}/>}
        {params.row.categoria == 'hamburguesas' && <img src={imagesHamburguesa} alt={params.row.nombre}  className='img-avatar-producto album' style={{viewTransitionName: `producto ${params.row.id} imagen`}} onPointerDown={()=> location.href = "/administracion/editarProducto/" + params.row.producto_id} data-name={`producto ${params.row.id} imagen`}/>}
        {params.row.categoria == 'bebidas' && <img src={imagesGaseosa} alt={params.row.nombre}  className='img-avatar-producto album' style={{viewTransitionName: `producto ${params.row.id} imagen`}} onPointerDown={()=> location.href = "/administracion/editarProducto/" + params.row.producto_id} data-name={`producto ${params.row.id} imagen`}/>}
        {params.row.categoria == 'pizzas' && <img src={imagesPizza} alt={params.row.nombre}  className='img-avatar-producto album' style={{viewTransitionName: `producto ${params.row.id} imagen`}} onPointerDown={()=> location.href = "/administracion/editarProducto/" + params.row.producto_id} data-name={`producto ${params.row.id} imagen`}/>}
        {params.row.categoria == 'perros' && <img src={imagesPerro} alt={params.row.nombre}  className='img-avatar-producto album' style={{viewTransitionName: `producto ${params.row.id} imagen`}} onPointerDown={()=> location.href = "/administracion/editarProducto/" + params.row.producto_id} data-name={`producto ${params.row.id} imagen`}/>}
    </div>
  )
}

export default RenderImages