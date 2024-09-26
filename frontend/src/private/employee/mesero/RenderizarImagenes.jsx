import React from 'react'
import imagesGaseosa from '../../../../public/imagenes/gaseosas.jpg'
import imagesPizza from '../../../../public/imagenes/pizza.png'
import imagesHamburguesa from '../../../../public/imagenes/hamburguesa.png'
import imagesPerro from '../../../../public/imagenes/perro.jpg'
const RenderizarImagenes = ({categoria}) => {
  return (
    < >
        {categoria == 'Pizzas' && <img src={imagesPizza} alt="img-producto-venecia"  />}
        {categoria == 'hamburguesas' && <img src={imagesHamburguesa} alt="img-producto-venecia"  />}
        {categoria == 'bebidas' && <img src={imagesGaseosa} alt="img-producto-venecia"  />}
        {categoria == 'pizzas' && <img src={imagesPizza} alt="img-producto-venecia"  />}
        {categoria == 'perros' && <img src={imagesPerro} alt="img-producto-venecia"  />}
    </>
  )
}

export default RenderizarImagenes