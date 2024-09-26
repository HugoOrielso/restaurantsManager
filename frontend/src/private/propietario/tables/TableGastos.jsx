/* eslint-disable react/prop-types */
import React from 'react'
import MUIDataTable from "mui-datatables";

const TableGastos = ({gastos}) => {
    gastos.forEach(element => {
        element.fecha = element.fecha.slice(0,10)
    });
    const columns = [
        {
            name: "id_gasto",
            label: "ID",
            headerClassName: 'super-app-theme--header'
        },
        {
            name:"description",
            label:"Descripción",
            headerClassName: 'super-app-theme--header'
        },
        {
            name:"fecha",
            label:"Fecha",
            headerClassName: 'super-app-theme--header'
        },
        {
            name: "monto",
            label: "Valor",
            headerClassName: 'super-app-theme--header'
        },
    ]
    return (
        <MUIDataTable title={"Gastos del día"} columns={columns} data={gastos} 
        sx={{
            boxShadow: 2,
            border: 2,
            borderColor: 'primary.light',
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
        />
    )
}

export default TableGastos