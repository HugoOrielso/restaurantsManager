/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import NavRecepcionista from './NavRecepcionista'
import TableReporteDomicilios from './TableReporteDomicilios'
import { customAxios } from '../../../../interceptors/axios.interceptor'
import { toast } from 'sonner'

const ReporteDomicilios = () => {
    const [datosReportados,setDatosReportados]= useState([])
    async function ajusteCaja(){
        try {
            const request = await customAxios.get('empleado/reporte/domicilios',{
                headers: {
                    "content-type":"application/json",
                    "Authorization": localStorage.getItem("token")
                },
                withCredentials: true
            })
            if(request.data.status=="success"){
                setDatosReportados(request.data.rows)
            }
        } catch (error) {
            toast.error("No se pudo obtenerr los datos.")
        }

    }
    useEffect(()=>{
        ajusteCaja()
    },[])
  return (
    <>
        <NavRecepcionista/>
        <main>
            <section>
                <TableReporteDomicilios data={datosReportados}/> 
            </section>
        </main>
    </>
  )
}

export default ReporteDomicilios