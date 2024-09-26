import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import NavDomiciliarios from './NavDomiciliarios'
import { customAxios } from '../../../../interceptors/axios.interceptor'
import { Toaster, toast } from 'sonner'

const MisDomicilios = () => {
    const [misDomiciliosEnCurso,setMisDomiciliosEnCurso]= useState([])
    const [isThereOrders, setIsThereOrders] = useState(false)
    const pedidosAgrupados = {};
    const socket = io("/")
    async function finalizarPedidoDomicilio(id){
      try {
        const request = await customAxios.post('empleado/domicilios/finalizar',
          {idPedido: id},
          {
          headers: {
              "content-type":"application/json",
              "Authorization":localStorage.getItem("token")
          },
          withCredentials: true
        })
        if(request.data.status=="success"){
          toast.success("Pedido finalizado correctamente.")
          setTimeout(()=>{
            location.reload()
          },2000)
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    async function liberarOrden(id){
      try {
        const request = await customAxios.post('empleado/domicilios/liberar',{idPedido: id} ,{
          headers: {
              "content-type":"application/json",
              "Authorization":localStorage.getItem("token")
          },
          withCredentials: true
        })
        if(request.data.status=="success"){
          toast.info("Pedido liberado correctamente.")
          setTimeout(()=>{
            location.reload()
          },2000)
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    async function misPedidosdomicilios (){
      const request = await customAxios.get('empleado/misDomicilios' ,{
          headers: {
              "content-type":"application/json",
              "Authorization":localStorage.getItem("token")
          },
          withCredentials: true
      })
      if(request.data.status==="success"){
          setMisDomiciliosEnCurso(request.data.domicilios)
          setIsThereOrders(true)
      }
      if(request.data.status ==="vacío"){
        toast.info("No tienes pedidos en curso")
      }
    }
    useEffect(()=>{
      misPedidosdomicilios()
    },[])
    if(isThereOrders){
      misDomiciliosEnCurso.forEach((pedido) => {
        const pedidoId = pedido.pedido_id;
        if (!pedidosAgrupados[pedidoId]) {
          pedidosAgrupados[pedidoId] = {
            id: pedidoId,
            direccion: pedido.direccion,
            tipo: pedido.tipo,
            total: pedido.total,
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
      toast.success(`Tienes ${Object.keys(pedidosAgrupados).length} domicilios asignados.`)

    }
    socket.on("pedidoCanceladoDomicilio", data=>{
      toast.warning(data)
      setTimeout(()=>{
        location.reload()
      },2500)
    })
    const renderPedidos = () => {
        return Object.values(pedidosAgrupados).map((grupo) => (
          <div key={grupo.id} className='domicilio-en-ruta'>
            <h4 className='id-pedido'>Pedido ID: {grupo.id}</h4>
            <ul className='ul-domicilios-en-curso'>
              {grupo.detalles.map((detalle, index) =>  (
                <li key={index}>
                    <div className='mini-grid'>
                        <span className='span-producto'>{detalle.producto_cantidad} </span>
                        <span className='span-price'> {detalle.total} </span>
                    </div>
                </li>
              ))}
            </ul>
            <div className='total-delivery'>
            </div>
            <div className='delivery-details'>
              <div className='text-detail'>
                  <p className='delivery-detail'>Domicilio: {grupo.direccion}</p>
              </div>
              <button className='button-take' onPointerDown={()=>{finalizarPedidoDomicilio(grupo.id)}} >Finalizar</button>
              <button className='button-take' onPointerDown={()=>{liberarOrden(grupo.id)}} >Liberar</button>
            </div>
          </div>
        ));
    };    

  return (
    <>
      <header className='header-domiciliario'>
          <NavDomiciliarios/>
      </header>
      <section style={{padding: '1em'}}>
        {renderPedidos()}
        {!isThereOrders ? <p>Sin pedidos</p>: ""}
      </section>
      <Toaster richColors/>
    </>
  )
}

export default MisDomicilios