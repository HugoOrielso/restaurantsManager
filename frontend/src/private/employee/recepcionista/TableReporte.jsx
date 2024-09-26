/* eslint-disable react/prop-types */
import React from 'react'
import MUIDataTable from 'mui-datatables'
const TableReporte = ({data}) => {
    const columns =[
        {
            name: "id",
            label: "ID",
        },
        {
            name:"tipo",
            label:"Tipo"
        },
        {
            name:"pago",
            label:"Pago",
        },
        {
            name: "total",
            label: "total"
        },
        {
            name: "fecha_pedido",
            label: "Fecha"
        }
    ]
  return (
    <MUIDataTable title={"Reporte"} data={data} columns={columns}/>
  )
}

export default TableReporte