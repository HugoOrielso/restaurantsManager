import React, { useEffect, useState } from 'react'
import NavRecepcionista from './NavRecepcionista'
import { useParams } from 'react-router-dom'
import '/public/css/print.css'
import '/public/css/transitionView.css'
import Images from './Images'
import {Print, Cancel} from '@mui/icons-material';
import io from 'socket.io-client'
import { Toaster, toast } from 'sonner'
import { customAxios } from '../../../../interceptors/axios.interceptor'

const PedidoEnCursoDetalle = () => {
    let total = 0
    const socket = io("/")
    const fechaActual = new Date()
    const year = fechaActual.getFullYear()
    const month = fechaActual.getMonth() + 1
    const day = fechaActual.getDate()
    const [detallesPedido, setDetallesPedido]= useState([])
    const [metodoDePago, setMetodoDePago] = useState("")
    const [infoAdicional, setInfoAdicional]= useState({})
    const {id} = useParams()
    async function obtenerPedidoEnCurso(){
        const request = await customAxios.get("empleado/recepcionista/" + id,{
          headers: {
            "content-type":"application/json",
            "Authorization": localStorage.getItem("token")
          },
          withCredentials: true
        })
        const data = await request.json()
        if(data.status=="success"){
          setDetallesPedido(data.detalles_pedido)
          setMetodoDePago(data.metodoDePago)
          setInfoAdicional(data.infoAdicional)
        }
      }

      async function cancelarOrden(){
        const query = await customAxios.delete('empleado/cancelar/' + id,{
          headers: {
            "content-type":"application/json",
            "Authorization": localStorage.getItem("token")
          },
          withCredentials: true
        })
        const data = await query.json()
        if(data.status=="success"){
          if(data.tipe=="mesa"){
            toast.warning("El pedido fue cancelado")
            socket.emit("pedidoCanceladoMesa", `El pedido con ID: ${id} fue cancelado`)
            setTimeout(()=>{
              location.href="/pedidosEnCurso"
            },2500)
          }else if(data.tipe=="domicilio"){
            toast.warning("El pedido fue cancelado")
            socket.emit("pedidoCanceladoDomicilio", `El domicilio con ID: ${id} fue cancelado`)
            setTimeout(()=>{
              location.href="/pedidosEnCurso"
            },2500)
          }
        }
      }
      useEffect(()=>{
        obtenerPedidoEnCurso()
      },[])
  return (
      <>
        <NavRecepcionista/>
        <main>
        <section >
          <div className='pedido-mesa-en-curso' >
            <section id='bill-area'>
              <header className='header-en-curso'>
                <div>Venecia</div>
                <div className='date-en-curso'> <span>{`${year}/${month}/${day}`}</span>  ID: {id}</div>
              </header>
              <main>
                <div className='title-detalle'>Detalles</div>
                {detallesPedido.map((detalle,i)=>
                {
                  let totalPrice = parseInt(detalle.cantidad * detalle.precio_unitario)
                  total = total + parseInt(detalle.cantidad * detalle.precio_unitario)
                  return(
                    <div className='name-cantidad' key={i}>
                      <div className='name-start'>
                        {detalle.nombre} <Images categoria={detalle.categoria}/>
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
                  <div>
                    {infoAdicional?.tipo == "mesa" && <>{infoAdicional.tipo}: {infoAdicional.informacion_adicional }</>}
                    {infoAdicional?.tipo == "domicilio" && <>{infoAdicional.tipo}: {infoAdicional.informacion_adicional }</>}
                  </div>
                  <div className='ruta-domi'>
                    {infoAdicional?.domiciliario != "disponible" ? <p style={{padding:"0", margin: "0"}}>Domiciliario: <strong>{infoAdicional?.domiciliario?.slice(0,10)}</strong> </p>: ""}
                    <p style={{padding:"0", margin: "0"}}>estado: <strong>{infoAdicional?.estado}</strong> </p>
                  </div>
              </footer>
            </section>
            <div className='div-botones-acciones noPrint'>
              <button className='finalizar-orden' >Finalizar orden</button>
              <button className='imprimir-orden' onPointerDown={()=>{window.print()}}>Imprimir <Print/></button>
              <button className='cancelar-orden' onPointerDown={cancelarOrden}>Cancelar <Cancel/> </button>
            </div>
          </div>
        </section>
        </main>
        <Toaster/>
      </>
  )
}

export default PedidoEnCursoDetalle