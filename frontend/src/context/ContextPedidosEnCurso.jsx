import { createContext, useEffect, useState} from "react";
import { Global } from "../helpers/Helpers";

export const PedidosEnCursoContext = createContext()


export function PedidosEnCursoProvider ({children}){
    const [pedidosEnCurso , setPedidoEnCurso ] = useState([])
    const [ mesasOcupadas , setMesasOcupadas ] = useState([])
    const [cart, setCart] = useState([])
    const fechaActual = new Date()
    const year = fechaActual.getFullYear()
    const month = fechaActual.getMonth() + 1
    const day = fechaActual.getDate()
    let estado = "en preparacion"
    async function ordersInCourse(){
        const fecha = {
            year: year,
            month: month,
            day: day
        };
        const request = await fetch(Global.url + "empleado/obtenerDomicilios/" + estado , {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization" : localStorage.getItem("token")
            },
            body: JSON.stringify(fecha)
        })
        const data = await request.json()
        if(data.status=="success"){
            setPedidoEnCurso(data.rows)
        }
    }
    const addToCart = product=>{
        const productInCart  = cart.findIndex(item=>item.id==product.id)
        if(productInCart >= 0){
            const newCart = structuredClone(cart)
            newCart[productInCart].quantity +=1
            return setCart(newCart)
        }

        setCart(prevState =>([
            ...prevState,
            {
                ...product,
                quantity:1
            }
        ]))
    }
    const clearCart=()=>{
         setCart([])
    }

    useEffect(()=>{
        ordersInCourse()
    },[])

    return(<PedidosEnCursoContext.Provider value={{pedidosEnCurso,setPedidoEnCurso, mesasOcupadas, cart, addToCart,clearCart}}>
        {children}
    </PedidosEnCursoContext.Provider>)
}