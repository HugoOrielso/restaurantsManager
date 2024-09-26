/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import '/public/css/cart.css'
import { useId, useState } from 'react'
import { CartIcon, RemoveFromCar } from './Icons.jsx'
import RenderizarImagenes from './RenderizarImagenes.jsx'
import { Global } from '../../../helpers/Helpers.jsx'
import { useParams } from 'react-router-dom'
import { customAxios } from '../../../../interceptors/axios.interceptor.jsx'
import { toast, Toaster } from 'sonner'
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
export function CartActualizar ({cart ,clearCart, addToCart}) {
  let total = 0
  const numeroDeMesa = useParams()
  const [metodoDePagoMesa,setMetodoDePagoMesa]= useState("efectivo")
  const cartCheckboxId = useId()
  const [observaciones, setObservaciones] = useState("ninguno")
  const handelObservaciones = (e)=>{
    setObservaciones(e.target.value)
  }
  async function crearPedido(productos){
    try {
      const request = await customAxios.put('empleado/editarPedido',
        {productos ,metodoDePago: metodoDePagoMesa, numeroDeMesa,observaciones},
        {
        headers: {
          "content-type":"application/json",
        },
        withCredentials: true
      })
      if(request.data.status == "success"){
        toast.info('Pedido actualizado correctamente.')
        setTimeout(()=>{
          location.href = "/inicioMesero"
        },2000)
      }
    } catch (error) {
      toast.error('No se pudo actualizar el pedido.')
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
          <div>
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
            <div className='observaciones' >
              <textarea type="text" placeholder='Observaciones del pedido' onChange={handelObservaciones}/>
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
      <Toaster richColors/>
    </>
  )
}