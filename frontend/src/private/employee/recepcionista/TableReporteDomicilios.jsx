/* eslint-disable react/prop-types */
import MUIDataTable from 'mui-datatables';
import React from 'react'
const TableReporteDomicilios = ({data}) => {
    const columns =[
        {
            name:"name",
            label:"Domiciliario",
        },
        {
            name:"pago",
            label:"Pago"
        },

        {
            name: "total",
            label: "total"
        },
        {
            name: "vueltos",
            label: "Vueltos"
        },
        {
            name: "fecha_pedido",
            label: "Fecha"
        },
        {
            name: "direccion",
            label: "Dirección"
        }
    ]
  return (
    <MUIDataTable title={"Reporte domicilios"} data={data} columns={columns}/>
  )
}

export default TableReporteDomicilios