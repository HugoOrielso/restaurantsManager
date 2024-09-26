/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import '/public/css/cart.css'
import { useId, useState } from 'react'
import { Global } from '../../../helpers/Helpers.jsx'
import io from 'socket.io-client'
import { CartIcon, RemoveFromCar } from '../mesero/Icons.jsx'
import RenderizarImagenes from '../mesero/RenderizarImagenes.jsx'
import { customAxios } from '../../../../interceptors/axios.interceptor.jsx'
function CartItem ({ categoria, price, title, quantity, addToCart }) {
  return (
    <li>
      <RenderizarImagenes categoria={categoria}/>
      <div className='titulos-price'>
        <strong className='carrito-text'>{title}</strong>  <span className='carrito-text'>${price}</span> 
      </div>

      <footer>
        <small className='carrito-text'>
          Cantidad: {quantity}
        </small>
        <button onClick={addToCart}>+</button>
      </footer>
    </li>
  )
}
export function CartRecepcionista ({cart ,clearCart, addToCart}) {
  let total = 0
  const socket = io()
  const [metodoDePagoMesa,setMetodoDePagoMesa]= useState("efectivo")
  const [direccionPedido,setDireccion] = useState("nada")
  const [observaciones,setObservaciones]= useState("ninguno")
  const [vueltos,setVueltos]= useState("completo")
  const handleObservaciones=(e)=>{
    setObservaciones(e.target.value)
  }
  const handleVueltos=(e)=>{
    setVueltos(e.target.value)
  }
  const cartCheckboxId = useId()
    function handleDireccion (e){
      setDireccion(e.target.value)
    }
  async function crearPedido(productos){
    let obj = {
      direccion: direccionPedido
    }
    const request = await customAxios.post(Global.url + 'empleado/crearPedido/recepcion',
      {productos,direccion:direccionPedido,metodoDePago: metodoDePagoMesa, totalPrice: total, observaciones, vueltos},

      {
      method: "POST",
      headers: {
        "content-type":"application/json",
        "Authorization": localStorage.getItem("token")
      },
      withCredentials: true
    })
    if(request.data.status == "success"){
      socket.emit("newOrderFromRecepcion", obj)
      location.reload()
    }
  }
  const handleMetodoDepago = (e)=>{
    setMetodoDePagoMesa(e.target.value);
  }
  return (
    <>
      <label className='cart-button' htmlFor={cartCheckboxId}>
        <CartIcon />
      </label>
      <input id={cartCheckboxId} type='checkbox' hidden />
      <aside className='cart'>
        <ul>
          {cart.map((product)=>{
            total = parseInt(total + (product.precio * product.quantity))
            return(
              <CartItem categoria={product.categoria} price={product.precio} quantity={product.quantity} title={product.nombre} 
                key={product.producto_id}
                addToCart={() => addToCart(product)}
                {...product}
              />
            )
          })}
        </ul>
          <div style={{padding: "0" , margin: "0"}}>
            <div className='metodos-de-pago'>
              <div className='container-info-final'>
                <span className='span-total'>
                  Total: 
                </span>
                <span className='span-total'>
                  ${total}
                </span>
              </div>
              <div>
                <select onChange={handleMetodoDepago} >
                  <option value="efectivo">Efectivo</option>
                  <option value="bancolombia">Bancolombia</option>
                  <option value="daviplata">Daviplata</option>
                </select>
              </div>
            </div>
            <div style={{margin: "1em 0", width: "100%"}}>
                <input type="text" placeholder='Dirección del pedido' className='input-direccion' onChange={handleDireccion} />
            </div>
            <div style={{margin: "1em 0", width: "100%"}}>
                <input type="text" placeholder='Vueltos' className='input-direccion' onChange={handleVueltos} />
            </div>
            <div className='observaciones' >
              <textarea type="text" placeholder='Observaciones del pedido' onChange={handleObservaciones}/>
            </div>
          </div>
          <div className='butons-actions-order'>
            <button onPointerDown={clearCart} className='button-vaciar'>
              <RemoveFromCar />
            </button>
            <button onPointerDown={()=>crearPedido(cart)} className='create-order'>
              Pagar 
            </button>
          </div>
      </aside>
    </>
  )
}