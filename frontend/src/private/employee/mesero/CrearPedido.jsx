/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import NavEmpleado from './NavEmpleado'
import '/public/css/crearPedido.css'
import Productos from './Productos'
import HeaderFiltros from './HeaderFiltros'
import Filters from './Filters.jsx'
import {Cart} from './Cart.jsx'
import { toast, Toaster } from 'sonner'
import { customAxios } from '../../../../interceptors/axios.interceptor.jsx'
const CrearPedido = () => {
  const [productos, setProductos] = useState([])
  const [filters,setFiltersProduct]=useState({
    category: "all",
    busqueda: ""
  })
  const [cart,setCart]=useState([])
  const filterProducts = (productos)=>{
    return productos.filter(producto=>{
      return (
        producto.nombre.toLowerCase().includes(filters.busqueda) &&
        (
          filters.category == "all" || filters.category == producto.categoria
        )
      )
    })
  }
  const filteredProducts = filterProducts(productos)
  const addToCart = producto=>{
    const productInCartIndex = cart.findIndex(item=>item.producto_id==producto.producto_id)    
    if(productInCartIndex >=0){
      const newCart= structuredClone(cart)
      newCart[productInCartIndex].quantity += 1
      return setCart(newCart)
    }
    setCart(prevState=>([
      ...prevState,
      {
        ...producto,
        quantity: 1
      }
    ]))
  }
  const removeFromCart = producto =>{
    setCart(prevState=>prevState.filter(item=>item.producto_id != producto.producto_id))
  }
  const clearCart = ()=>{
    setCart([])
  }
  async function getProducts(){
    try {
      const request = await customAxios.get('empleado',{
        headers: {
          "content-type": "application/json",
        },
        withCredentials: true
      })
      if(request.data.status== "success"){
        setProductos(request.data.query)
      }
    } catch (error) {
      toast.error('Ocurrió un error obteniendo los productos')
    }

  }
  useEffect(()=>{
    getProducts()
  },[])
  return (
    <>
      <NavEmpleado/>
      <main className='main-tienda'>
        <HeaderFiltros>
          <Filters onChange={setFiltersProduct}/>
        </HeaderFiltros>
        <section >
          <Productos productos={filteredProducts} addCart={addToCart} cart={cart} removeFromCart={removeFromCart}/>
          <Cart cart={cart} clearCart={clearCart} addToCart={addToCart}/>
        </section>
      </main>
      <Toaster richColors/>

    </>
  )
}

export default CrearPedido