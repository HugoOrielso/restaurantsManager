/* eslint-disable react/prop-types */
import React from 'react'
import RenderizarImagenes from './RenderizarImagenes'
import { AddToCart, RemoveIcon } from './Icons'
import '../../../../public/css/productos.css'
const Productos = ({productos, addCart, cart, removeFromCart}) => {
    const checkProductInCart = producto=>{
        return cart.some(item => item.producto_id == producto.producto_id)
    }
    return (
      <div className='productos-venecia'>
            <ul>
                {productos.map((producto)=> {
                  const isProductInCart = checkProductInCart(producto)
                  return(
                      <li key={producto.producto_id}>
                          <RenderizarImagenes categoria={producto.categoria}/>
                          <div className='utils-producto'> 
                              <div className='text-product'>
                                  <strong className='strong-name'>{producto.nombre} - ${producto.precio}</strong>
                                  {producto.subcategoria != "ninguno" && <span>{producto.subcategoria}</span> }
                              </div>
                              <button className={`button-add-to-cart ${isProductInCart ? "remove" : "   "}`} onPointerDown={()=>{
                                isProductInCart ? removeFromCart(producto) : addCart(producto)}}>
                                  {
                                      isProductInCart ? <RemoveIcon/> : <AddToCart/>
                                  }
                              </button>
                          </div>
                      </li>
                  )
              })}
            </ul>
      </div>
    )
}

export default Productos