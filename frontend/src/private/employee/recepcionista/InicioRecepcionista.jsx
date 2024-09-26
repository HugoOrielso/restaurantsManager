import React, { useEffect, useState } from 'react'
import ProductosRecepcionista from './ProductosRecepcionista'
import { CartRecepcionista } from './CartRecepcionista'
import Filters from '../mesero/Filters'
import HeaderFiltros from '../mesero/HeaderFiltros'
import NavRecepcionista from './NavRecepcionista'
import { customAxios } from '../../../../interceptors/axios.interceptor'

const InicioRecepcionista = () => {
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
    const request = await customAxios('empleado',{
      headers: {
        "content-type": "application/json",
        "Authorization": localStorage.getItem("token")
      },
      withCredentials: true
    })
    if(request.data.status== "success"){
      setProductos(request.data.query)
    }
  }
  useEffect(()=>{
    getProducts()
  },[])
  return (
    <>
      <NavRecepcionista/>
      <main>
          <HeaderFiltros>
            <Filters onChange={setFiltersProduct}/>
          </HeaderFiltros>
          <ProductosRecepcionista productos={filteredProducts} addCart={addToCart} cart={cart} removeFromCart={removeFromCart}/>
          <CartRecepcionista cart={cart} clearCart={clearCart} addToCart={addToCart}/>
      </main>
    </>
  )
}

export default InicioRecepcionista