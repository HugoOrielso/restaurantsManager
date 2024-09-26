/* eslint-disable react/prop-types */
import React from 'react'
import {ResponsiveContainer , Tooltip ,XAxis , BarChart, CartesianGrid , YAxis, Legend , Bar} from 'recharts' 
import '/public/css/chart.css'
import { Bills } from './IconsNav'
const ChartBox = ({allPedidos}) => {
  let data = [];
  allPedidos.forEach(element => {
    data.push(element)
  });
  
  const fechaActual = new Date()
  const year = fechaActual.getFullYear()
  const month = fechaActual.getMonth() + 1
  const day = fechaActual.getDate()
  const fechaHaceUnaSemana = new Date(fechaActual);
  fechaHaceUnaSemana.setDate(fechaActual.getDate() - 7);
  const monthMenos = fechaHaceUnaSemana.getMonth() + 1
  const dayMenos = fechaHaceUnaSemana.getDate() 
  const yearMenos = fechaHaceUnaSemana.getFullYear() 
  let fecha = `${year}/${month}/${day}`
  return (
    <section className='chartBox'>
        <div className='boxInfo'>
            <div className="titleChart">
                <span>Análisis últimos 7 días</span>
                <Bills/>
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <span>Desde: {fecha}</span>
                <span>Hasta: {yearMenos}/{monthMenos}/{dayMenos} </span>
            </div>
        </div> 
        <div className='chartInfo'>
            <div className="chart">
                
                <ResponsiveContainer width="100%" aspect={2}>

                    <BarChart data={data} width={500} height={300} margin={{top:5 , right:5,bottom:5, left:5} }>
                        <CartesianGrid strokeDasharray="4,1"/>
                        <XAxis dataKey="fecha"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="total_pedidos" fill='#6b48ff'/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </section>
  )
}

export default ChartBox