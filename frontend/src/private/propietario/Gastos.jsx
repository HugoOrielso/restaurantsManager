import React, { useEffect, useState } from 'react'
import AsideOwner from './AsideOwner'
import NavBarOwner from './NavBarOwner'
import TableGastos from './tables/TableGastos'
import ModalGastos from './ModalGastos'
import '/public/css/balance.css'
import { customAxios } from '../../../interceptors/axios.interceptor'
import { toast, Toaster } from 'sonner'

const Gastos = () => {
    const [gastos, setGastos] = useState([])
    const [gastosDeLaSemana,setGastosDeLaSemana]= useState([])
    const [modalGasto,setModalGasto] = useState(false)
    let totalSemana = 0
    let totalGastos = 0

    async function obtenerGastos(){
        const request = await customAxios.get("propietario/gastos", {
            headers: {
                "content-type": "application/json",
            }
        })

        if(request.data.status == "success"){
            setGastos(request.data.gastos)
            setGastosDeLaSemana(request.data.gastosSemana)
            acomodarGastos()
        }

        if(request.data.status == "vacío"){
            toast.info("No hay gastos registrados para la fecha")
        }
    }

    function acomodarGastos(){
        gastosDeLaSemana.forEach(gasto=>{
            totalSemana = totalSemana + parseInt(gasto.monto)
        })
        gastos.forEach(gasto=>{
            gasto.monto = parseInt(gasto.monto)
            totalGastos = totalGastos + gasto.monto
        })
    }

    function toggleModalGastos(){
        setModalGasto(true)
    }
    useEffect(()=>{
        obtenerGastos()
    },[])

  return (
    <>
    <NavBarOwner/>
    <section className='wrapper' >
        <AsideOwner/>
        <main >
            <div className='header-gasto'>
                <button className='add-product' onPointerDown={toggleModalGastos}>Registrar gastos</button>
                <div className='fecha-ingresos-day'><span style={{color: "red"}}>Gastos totales del día:</span>  <strong>{totalGastos}</strong> </div>
                <div className='fecha-ingresos-day'><span style={{color: "red"}}>Gastos de la semana:</span>  <strong>{totalSemana}</strong> </div>
            </div>
            <section className='gastos'>
                <TableGastos gastos={gastos}/>
            </section>
        </main>

        {modalGasto && <ModalGastos abrir={setModalGasto}/>}
    </section>
    <Toaster richColors/>
    </>
  )
}

export default Gastos
