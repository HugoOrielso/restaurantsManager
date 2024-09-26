/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NavEmpleado from './NavEmpleado'
import HeaderFiltros from './HeaderFiltros'
import '/public/css/pedidoEnCurso.css'
import Filters from './Filters'
import ProductosActualizar from './ProductosActualizar'
import { CartActualizar } from './CartActualizar'
import io from 'socket.io-client'
import { Toaster, toast } from 'sonner'
import { customAxios } from '../../../../interceptors/axios.interceptor'

const ActualizarPedido = () => {
  const {mesaOcupada}=useParams()
  const socket = io("/")
  const fechaActual = new Date()
  const year = fechaActual.getFullYear()
  const month = fechaActual.getMonth() + 1
  const day = fechaActual.getDate()
  const [detallesPedido, setDetallePedido]=useState([])
  const [metodoDePago,setMetodoDePago]=useState("")
  const [productos, setProductos] = useState([])
  const [estadoMesa, setEstadoMesa] = useState('')
  const [cart,setCart]=useState([])
  const [filters,setFiltersProduct]=useState({
    category: "all",
    busqueda: ""
  })
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
  socket.on("pedidoCanceladoMesa", data=>{
    toast.warning(data)
    setTimeout(()=>{
      location.href("/inicioMesero")
      location.reload()
    },2000)
  })
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
  let total = 0
  async function obtenerPedidoEnCurso(){
    try {
      const request = await customAxios.get("empleado/obtenerPedido/" + mesaOcupada,{
        headers: {
          "content-type":"application/json",
        },
        withCredentials:true
      })
      if(request.data.status=="success"){ 
        setEstadoMesa(request.data.estado)
        setDetallePedido(request.data.detalles_pedido)
        setMetodoDePago(request.data.metodoDePago)
      }
    } catch (error) {
      toast.error('Ocurrió un error obteniendo la data del pedido.')
    }

  }
  
  async function getProducts(){
    try {
      const request = await customAxios.get('empleado',{
        headers: {
          "content-type": "application/json",
        },
        withCredentials:true
      })
      if(request.data.status== "success"){
        setProductos(request.data.query)
      }
    } catch (error) {
      toast.error('Ocurrió un error obteniendo el pedido')
    }

  }
  async function finalizarOden(){
    try {
      const request = await customAxios.post('empleado/finalizar/' + mesaOcupada,{
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        withCredentials: true
      })
      if(request.data.status=="success"){
        toast.success('Pedido finalizado correctamente')
        setTimeout(()=>{
          location.href = "/inicioMesero"
        },1000)
      }
    } catch (error) {
      toast.error('No se pudo finalizar la orden')
    }

  }
  useEffect(()=>{
    obtenerPedidoEnCurso()
    getProducts()
  },[])
  return (
    <>
      <NavEmpleado/>
      <main>
        <section>
          <div className='pedido-mesa-en-curso'>
            <header className='header-en-curso'>
              <div>Venecia</div>
              <div className='date-en-curso'> <span>{`${year}/${month}/${day}`}</span>  mesa {mesaOcupada}</div>
            </header>
            <main>
              <div className='title-detalle'>Detalles</div>
              {detallesPedido.map((detalle,i)=>{
                let totalPrice = parseInt(detalle.cantidad * detalle.precio_unitario)
                total = total + parseInt(detalle.cantidad * detalle.precio_unitario)
                return(
                  <div className='name-cantidad' key={i}>
                    <div className='name-start'>
                      {detalle.nombre}
                    </div>
                    <div className='cantidades'>
                       x{detalle.cantidad}
                    </div>
                    <div className='total-detalle'>
                      $ {totalPrice}
                    </div>
                  </div>
                )
              })}
            </main>
            <footer className='footer-en-curso'>
                <div className='total-orden'>
                  Total: ${total}
                </div>
                <div>
                  Método de pago: {metodoDePago}
                </div>
            </footer>
            <div className='div-botones-acciones'>
              {
                estadoMesa == 'en mesa' &&
                <button className='finalizar-orden' onPointerDown={finalizarOden}>Finalizar orden</button>
              }
            </div>
          </div>
        </section>
        <HeaderFiltros>
          <Filters onChange={setFiltersProduct}/>
        </HeaderFiltros>
        <section >
          <ProductosActualizar productos={filteredProducts} addCart={addToCart} cart={cart} removeFromCart={removeFromCart}/>
          <CartActualizar cart={cart} clearCart={clearCart} addToCart={addToCart}/>
        </section>
      </main>
      <Toaster richColors/>
    </>
  )
}

export default ActualizarPedido