import React, { useEffect, useState } from 'react'
import '/public/css/chart.css'
import {ResponsiveContainer , Tooltip ,XAxis , BarChart, CartesianGrid , YAxis, Legend , Bar} from 'recharts' 
import { customAxios } from '../../../interceptors/axios.interceptor'

const MaxVentas = () => {
  const data = []
  const [maxVentas ,setMaxVentas]= useState([])
  const [isThereVentas, setIsThereVentas] = useState(false)
  async function productosMasVendidos(){
    const request = await customAxios.get('propietario/productosMasVendidos', {
      headers: {
        "content-type":"application/json",
      },
      withCredentials: true
    })
    if(request.data.status=="success"){
      setMaxVentas(request.data.ventas)
      setIsThereVentas(true)
    }
  }
  if(isThereVentas){
    maxVentas.forEach(element => {
      data.push(element)
    });
  }
  useEffect(()=>{
    productosMasVendidos()
  },[])
  return (
    <section className='container-max-ventas'>
        <div className='info-max-ventas'>
            <span> <strong>Los 5 productos más vendidos</strong> </span>
        </div>
        <div className='container-grafico-torta' style={{width: "100%"}}>
            <ResponsiveContainer width="100%" aspect={1}>
              <BarChart data={data} width={500} height={300} margin={{top:5 , right:5,bottom:5, left:5}}>
                <CartesianGrid strokeDasharray="4,1"/>
                <XAxis dataKey="nombre"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="total_ventas" fill='#a54f1e'/>
              </BarChart>
            </ResponsiveContainer>
        </div>
    </section>
  )
}

export default MaxVentas