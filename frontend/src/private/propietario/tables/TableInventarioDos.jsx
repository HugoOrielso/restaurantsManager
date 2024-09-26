/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react'
import '/public/css/Table.css'
import '/public/css/transitionView.css'

import {DataGrid, GridToolbar} from '@mui/x-data-grid'
import { Box } from '@mui/material'
import ProductsActions from './ProductsActions'
import RenderImages from './RenderImages'

const TableInventarioDos = ({inventario}) => {
  const [rowId, setRowID]= useState(null)
  const columns = useMemo(()=>[
    {field: "producto_id", headerName: "Id", width:10,headerClassName: 'super-app-theme--header'},
    {field: "imagen", headerName: "Imágen", width: 100,headerClassName: 'super-app-theme--header', renderCell: params=> <RenderImages {...{params}}/>},
    {field: "nombre", headerName: "Nombre", width:260, headerClassName: 'super-app-theme--header', renderCell:
      params => <span data-name={`Producto ${params.row.nombre} title`} style={{viewTransitionName: `Producto ${params.row.nombre} title`}}>{params.row.nombre}</span>
    },
    {field: "precio", headerName: "Precio", width:160,headerClassName: 'super-app-theme--header'},
    {field: "categoria", headerName: "Categoría", width:160,headerClassName: 'super-app-theme--header'},
    {field: "subcategoria", headerName: "subcategoría", width:160,headerClassName: 'super-app-theme--header'},
    {field: "action", headerClassName: 'super-app-theme--header',headerName:"Acciones" , type: 'acciones', renderCell:params=>  <ProductsActions {...{params, rowId, setRowID}}/>}
  ],[rowId])
  return (
    <div className='dataTable' >
    <Box sx={{height:400, width: "100%"}}>
        <DataGrid
          columns={columns}
          className='dataGrid'
          rows={inventario}
          getRowId={row=>row.producto_id}
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: 'primary.light',
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 15, 20]}
          slots={{toolbar:GridToolbar}}
          slotProps={{
            toolbar:{
              showQuickFilter:true,
              quickFilterProps:{debounceMs:500}
            }
          }}
          onCellEditCommit={params=>setRowID(params.id)}
        />
    </Box>
    </div>
  )
}

export default TableInventarioDos



