import React, { useEffect, useState } from 'react'
import { customAxios } from '../../../interceptors/axios.interceptor'

const Curso = () => {
    const [isThereOrders, setIsThereOrders] = useState(false)
    const [todosLosPedidos, setTodosLosPedidos] = useState()
    let pedidosAgrupados = {};

      async function allPedidosEnCurso(){
        const request = await customAxios.get('empleado/allOrders',{
            headers: {
                "content-type":"application/json",
                "Authorization": localStorage.getItem("token")
            },
            withCredentials: true
        })
        if(request.data.status=="success"){
          setTodosLosPedidos(request.data.pedidos)
          setIsThereOrders(true)
        }
      }

      if(isThereOrders){
        todosLosPedidos?.forEach((pedido) => {
        const pedidoId = pedido.pedido_id;
        if (!pedidosAgrupados[pedidoId]) {
          pedidosAgrupados[pedidoId] = {
            id: pedidoId,
            mesa: pedido.mesa,
            direccion: pedido.direccion,
            tipo: pedido.tipo,
            estado: pedido.estado,
            domiciliario: pedido.usuario_encargado,
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
      return Object.values(pedidosAgrupados).map((grupo) => (
        <div key={grupo.id} className='pedido-cocina-owner'>
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
            <footer  className='footer-detalle-pedido'>
              <div className='tipo-pedido'>
                {grupo.tipo === 'mesa' ? (
                <p className='tipo-mesa'>Mesa: {grupo.mesa}</p>
                ) : grupo.tipo === 'domicilio' ? (
                  <>
                    <p className='tipo-delivery'>Domicilio: {grupo.direccion}</p>
                    <p className='tipo-delivery'>{grupo.domiciliario == "disponible" ? <p className='tipo-delivery'>Sin asignación</p> : <p className='tipo-delivery'>{grupo.domiciliario.slice(0,10)}</p>}</p>
                  </>
                ) : null}
              </div>
              <div>
                <p style={{textAlign: "start"}}>
                  <strong>{grupo.estado}</strong> 
                </p>
              </div>
            </footer>
        </div>
      ));
    };
    useEffect(()=>{
        allPedidosEnCurso()
    },[])
  return (
    <section className='section-todos-los-pedidos'>
        {renderPedidos()}
    </section>
  )
}

export default Curso