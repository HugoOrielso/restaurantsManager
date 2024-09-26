import React from 'react'
import imagesGaseosa from '../../../../public/imagenes/gaseosas.jpg'
import imagesPizza from '../../../../public/imagenes/pizza.png'
import imagesHamburguesa from '../../../../public/imagenes/hamburguesa.png'
import imagesPerro from '../../../../public/imagenes/perro.jpg'
import  '/public/css/circle.css'
const Images = ({categoria}) => {
  return (
    <>
        {categoria == 'Pizzas' && <img src={imagesPizza} alt="circle-img"  className='circle-img' />}
        {categoria == 'hamburguesas' && <img src={imagesHamburguesa} alt="circle-img"  className='circle-img'/>}
        {categoria == 'bebidas' && <img src={imagesGaseosa} alt="circle-img"  className='circle-img'/>}
        {categoria == 'pizzas' && <img src={imagesPizza} alt="circle-img"  className='circle-img'/>}
        {categoria == 'perros' && <img src={imagesPerro} alt="circle-img"  className='circle-img'/>}
    </>
  )
}

export default Images