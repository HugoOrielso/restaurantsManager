/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AsideOwner from './AsideOwner'
import NavBarOwner from './NavBarOwner'
import TableIngresos from './tables/TableIngresos'
import { customAxios } from '../../../interceptors/axios.interceptor'
import { toast, Toaster } from 'sonner'

const Ingresos = () => {
  const [ ingresos , setIngresos ] = useState([])
  const [ingresosDeLaSemana,setIngresosDeLaSemana]=useState([])
  let totalSemana = 0
  const fechaActual = new Date()
  const year = fechaActual.getFullYear()
  const month = fechaActual.getMonth() + 1
  const day = fechaActual.getDate()
  let total = 0
  const obtenerGanascias = async ()=>{
    try {
      const request = await customAxios.get("propietario/ganancias", {
        headers: {
          "content-type": "application/json",
          "Authorization": localStorage.getItem("token")
        },
        withCredentials: true
      })
      if(request.data.status=="success"){
        setIngresos(request.data.rows)
        setIngresosDeLaSemana(request.data.ingresosSemana)
        return
      }
      toast.info("No hay ingresos registrados a la fecha")
    } catch (error) {
      toast.error("Ocurrió un error al obtener los ingresos, intenta más tarde.")
    }

  }
  ingresos.forEach(ingreso=>{
    ingreso.total = parseFloat(ingreso.total)
    total = total + ingreso.total
  })

  ingresosDeLaSemana.forEach(ingreso=>{
    ingreso.total = parseFloat(ingreso.total)
    totalSemana = totalSemana + ingreso.total
  })
  useEffect(()=>{
    obtenerGanascias()
  },[])
  return (
    <>
    <NavBarOwner/>
    <section className='wrapper' >
    <AsideOwner/>
    <main >
        <section>
          <div className='info-table-ingresos'>
            <div className='fecha-ingresos-day'>
              <span className='fecha-today'> {`${year}/${month}/${day}`}</span>
              <p>Total del día: <strong>{total}</strong> </p>
            </div>
            <div className='cuadro-ingresos'>
              <p>Total de la semana: <strong>{totalSemana}</strong></p>
            </div>
          </div>
          <section className='table w-[100%]'>
            <TableIngresos dataIngresos={ingresos}/>
          </section>
        </section>
    </main>
  </section>  
  <Toaster richColors/>
  </>
)
}

export default Ingresos