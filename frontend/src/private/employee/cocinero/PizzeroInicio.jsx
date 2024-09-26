import React, { useEffect, useState } from 'react'
import { Global } from '../../../helpers/Helpers'
import io from 'socket.io-client'
import {Toaster, toast} from 'sonner'
import '/public/css/pedidosCocina.css'
import NavCocinero from './NavCocinero'
const PizzeroInicio = () => {
  const socket = io("/")
  const [isThereOrders, setIsThereOrders] = useState(false)
  const audio = new Audio('../../../../public/assets/audios/hamburguesas.mp3'); 
  const playNotificationSound = () => {
    audio.play();
  }
  async function entregarPedido(id){
    const request = await fetch(Global.url + 'empleado/pedidosEnCursoCocineros/' + id,{
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    })
    const data = await request.json()
    if(data.status=="success"){
      setTimeout(()=>{
        location.reload()
      },1000)
    }
  }
  const [pedidosEnCurso , setPedidosEnCurso] = useState([])
  async function pedidosEnCursoCocineros (){
    const request = await fetch(Global.url + "empleado/pedidosEnCursoCocineros/pizzero",{
      method: "GET",
      headers: {
        "content-type":"application/json",
        "Authorization": localStorage.getItem("token")
      }
    })
    const data = await request.json()
    if(data.status == "success"){
      setPedidosEnCurso(data.pedidosPizzas)
      setIsThereOrders(true)
    }
  }
  socket.on("pedidoCanceladoDomicilio",data=>{
    toast.warning(data)
    setTimeout(()=>{
      location.reload()
    },2500)
  })
  socket.on("pedidoCanceladoMesa", data=>{
    toast.warning(data)
    setTimeout(()=>{
      location.reload()
    },2500)
  })
  socket.on("newOrderFromMesa", data=>{
    toast(`Nuevo pedido recibido de la mesa ${data?.mesa.numeroDeMesa}`)
    playNotificationSound()
    setTimeout(()=>{
      location.reload()
    },2000)
  })
  const pedidosAgrupados = {};
      if(isThereOrders){
      pedidosEnCurso.forEach((pedido) => {
        const pedidoId = pedido.pedido_id;
        if (!pedidosAgrupados[pedidoId]) {
            pedidosAgrupados[pedidoId] = {
                id: pedidoId,
                mesa: pedido.mesa,
                direccion: pedido.direccion,
                tipo: pedido.tipo,
                observaciones: pedido.observaciones,
                detalles: [],
            };
        }
        pedidosAgrupados[pedidoId].detalles.push({
          tipo: pedido.tipo,
          mesa: pedido.mesa,
          pago: pedido.pago,
          estado: pedido.estado,
          direccion: pedido.direccion,
          precio_unitario: pedido.precio_unitario,
          total: pedido.total,
          producto_cantidad: pedido.producto_cantidad,
          categoria: pedido.categoria,
          subcategoria: pedido.subcategoria,
        });
      });
  }
  const renderPedidos = () => {
    return Object.values(pedidosAgrupados).map((grupo) =>  (
      <div key={grupo.id} className='pedido-cocina'>
        <h4 className='id-pedido'>Pedido ID: {grupo.id}</h4>
        <ul className='ul-detalle-pedido-en-curso'>
          {grupo.detalles.map((detalle, index) => (
            <li key={index}>
              <div className='informacion-cocina'>
                <span>{detalle.producto_cantidad}</span>
                {detalle.categoria == "pizzas" && <span className='subcategory'> - {detalle.subcategoria}</span>}
              </div>
            </li>
          ))}
        </ul>
        <footer>
          <div className='detail-observaciones'>
            {grupo.observaciones == "ninguno" ? "" : <div >Observaciones:
            <p className='p-observaciones'>{grupo.observaciones}!</p></div> }
          </div>
          <div className='tipo-pedido'>
            {grupo.tipo === 'mesa' ? (
            <p className='tipo-mesa'>Mesa: {grupo.mesa}</p>
            ) : grupo.tipo === 'domicilio' ? (
            <p className='tipo-delivery'>Domicilio: {grupo.direccion}</p>
            ) : null}
          </div>
          <div>
            <button className='btn-entregar' onPointerDown={()=>{entregarPedido(grupo.id)}}>Entregar</button>
          </div>
        </footer>
      </div>
    ));
  };
  useEffect(()=>{
    pedidosEnCursoCocineros()
  },[])
  return (
    <>
      <NavCocinero/>  
      <main>
        <section className='container-pedido-cocina'>
          { isThereOrders ? renderPedidos() : <p>No hay pedidos</p>}
        </section>
        <Toaster/>
      </main>
    </>
  )
}

export default PizzeroInicio