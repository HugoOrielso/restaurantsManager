/* eslint-disable react/prop-types */
import React from 'react'
import MUIDataTable from "mui-datatables";
const TableIngresos = ({dataIngresos}) => {
    const columns = [
        {
            name: "id",
            label: "ID",
        },
        {
            name:"tipo",
            label:"Tipo"
        },
        {
            name:"estado",
            label:"Estado",
        },
        {
            name: "total",
            label: "total"
        }
    ]
    return (
        <MUIDataTable title={"Ingresos del día"} data={dataIngresos} columns={columns}/>
    )
}

export default TableIngresos