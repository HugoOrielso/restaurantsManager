import React, { useEffect, useState } from 'react'
import NavRecepcionista from './NavRecepcionista'
import TableReporte from './TableReporte'
import '/public/css/reportes.css'
import { customAxios } from '../../../../interceptors/axios.interceptor'
const ReporteDelDia = () => {
    let ganancias = 0
    const [datosReportados,setDatosReportados]= useState([])
    async function ajusteCaja(){
        const request = await customAxios.get('empleado/reporte/general',{
            headers: {
                "content-type":"application/json",
                "Authorization": localStorage.getItem("token")
            },
            withCredentials: true
        })
        if(request.data.status=="success"){
            setDatosReportados(request.data.rows)
        }
    }
    datosReportados.forEach(dato=>{
        ganancias = parseInt(ganancias) + parseInt(dato.total)
    })
    useEffect(()=>{
        ajusteCaja()
    },[])
  return (
    <>
        <NavRecepcionista/>
        <main>
            <section className='mini-header'>
                <div>
                    Ingresos: {ganancias}
                </div>
            </section>
            <section>
                <TableReporte data={datosReportados}/>
            </section>
        </main>
    </>
  )
}

export default ReporteDelDia