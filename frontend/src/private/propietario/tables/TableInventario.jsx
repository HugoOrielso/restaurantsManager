/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, TextField, Button } from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Edit, Delete} from '@mui/icons-material'
import { useForm } from 'react-hook-form';
import { Global } from '../../../helpers/Helpers';
const useStyles = makeStyles((theme) => ({
    modal: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    iconos:{
      cursor: 'pointer'
    }, 
    inputMaterial:{
      width: '100%'
    }
  }));
const TableInventario = ({inventario}) => {
    const {register, handleSubmit, formState:{errors}} = useForm({})
    const styles= useStyles();
    const [modalInsertar, setModalInsertar]=useState(false);
    const abrirCerrarModalInsertar=()=>{
        setModalInsertar(!modalInsertar);
    }
    async function insertarProductoEnDB(e){
        let obj = {
            nombre: e.nombre,
            precio: parseInt(e.precio),
            categoria: e.categoria,
            subcategoria: e.subcategoria
        }
        const request = await fetch(Global.url + 'propietario/productos', {
            method: "POST",
            headers: {
                "content-type":"application/json",
                "Authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(obj)
        })
        const data = await request.json()
    }
      const bodyInsertar=(
        <div className={styles.modal}>
            <form onSubmit={handleSubmit(insertarProductoEnDB)}>
                <h3>Agregar nuevo producto</h3>
                <TextField  className={styles.inputMaterial} label="Nombre" {...register("nombre")} />
                <br />
                <TextField  className={styles.inputMaterial} label="Precio" {...register("precio")} />
                <br />
                <TextField  className={styles.inputMaterial} label="Categoría" {...register("categoria")} />
                <br />
                <TextField  className={styles.inputMaterial} label="Subcategoría" {...register("subcategoria")} />
                <br /><br />
                <div align="right">
                <Button color="primary" type='submi'>Insertar</Button>
                <Button onPointerDown={abrirCerrarModalInsertar} >Cancelar</Button>
          </div>
          </form>
        </div>
      )
      async function filtro(e){
        const handleChangeCategory = (event)=>{
            onChange(prevState=>({
                ...prevState,
                category: event.target.value
            }))
        }
      }
  return (
    <>  

        <Button onClick={()=>abrirCerrarModalInsertar()}>Insertar</Button>
        <TableContainer >
            <input type="text" onChange={filtro}/>
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Pecio</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell>Subcategoría</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    {inventario.map((producto,i)=>{
                        return(
                            <TableRow key={i}>
                                <TableCell>{producto.nombre}</TableCell>
                                <TableCell>{producto.precio}</TableCell>
                                <TableCell>{producto.categoria}</TableCell>
                                <TableCell>{producto.subcategoria}</TableCell>
                                <TableCell>
                                    <Edit/>
                                    &nbsp;&nbsp;&nbsp;
                                    <Delete/>
                                </TableCell>                                
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table >
        </TableContainer>
        <Modal
        open={modalInsertar}
            onClose={abrirCerrarModalInsertar}>
            {bodyInsertar}
        </Modal>

    </>
  )
}

export default TableInventario



