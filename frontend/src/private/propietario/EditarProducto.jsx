import React, { useEffect, useState } from 'react'
import NavBarOwner from './NavBarOwner'
import AsideOwner from './AsideOwner'
import {  useParams } from 'react-router-dom'
import '/public/css/single.css'
import '/public/css/transitionView.css'
import { SimpleLineChat } from './SimpleLineChart'
import ImagenesEdit from './ImagesEdit'
import { useForm } from 'react-hook-form'
import { serealizeForm } from '../../helpers/SerealizeForm'
import {  customAxios } from '../../../interceptors/axios.interceptor'

const EditarProducto = () => {
  const [producto,setProducto] = useState()
  const {register, handleSubmit, formState: {errors}} = useForm([])
  
  const [countSales,setCountSales]= useState([])
  const {id} = useParams()

  async function countSalesFunction(){
    const request = await customAxios.get('propietario/producto/' + id,{
      headers: {
        "content-type":"application/json",
      },
      withCredential:true
    })
    if (request.data.status=="success") {
      setCountSales(request.data.row)
    }
  }

  async function obtenerSingleProduct(){
    const request = await customAxios.get('propietario/singleProduc/' + id,{
      headers: {
        "content-type":"application/json",
      }
    })
    if (request.data.status=="success") {
      setProducto(request.data.row)
      countSalesFunction()
    }
  }

  async function editarProducto(e){
    e.preventDefault()
    let newDataProduct = serealizeForm(e.target)
    const request = await customAxios.put('propietario/producto/' + id, {newDataProduct}, {
      headers: {
        "content-type":"application/json",
      },
      withCredentials: true
    })

    if(request.data.status=="success"){{
      location.reload()
    }}
  }

  useEffect(()=>{
    obtenerSingleProduct()
  },[])
  return (
    <>
        <NavBarOwner/>
        <div className='main-propietario'>
        <AsideOwner/>
          <section className='single'>
            <div className='view'>
              <div className="topInfo">
                <h1 style={{color:"red"}}>{producto?.[0]?.nombre}</h1>
                <ImagenesEdit categoria={producto?.[0]?.categoria || ''} id={id}/>
              </div>
              <div className='container-formulario-edit-product'>
                <form action="" className='formulario-editar' onSubmit={editarProducto}>
                  <div className='item-editar'>
                    <label htmlFor="nombre" className='label-edicion'>Nombre</label>
                    <input type="text" id='nombre' style={{viewTransitionName:`Producto ${producto?.[0]?.nombre} title` }} data-name={`Producto ${producto?.[0]?.nombre} title`} defaultValue={producto?.[0]?.nombre || ''} className='input-form-edicion' {...register("nombre")} />
                  </div>
                  <div className='item-editar'>
                    <label htmlFor="precio" className='label-edicion'>Precio</label>
                    <input type="text" id='precio' defaultValue={producto?.[0]?.precio || ''} className='input-form-edicion' {...register("precio")}/>
                  </div>
                  <div className='item-editar'>
                    <label htmlFor="categoria" className='label-edicion'>Categoría</label>
                    <input type="text" id='categoria' defaultValue={producto?.[0]?.categoria || ''} className='input-form-edicion' {...register("categoria")}/>
                  </div>
                  <div className='item-editar'>
                    <label htmlFor="subcategoria" className='label-edicion'>Subcategoría</label>
                    <input type="text" id='subcategoria' defaultValue={producto?.[0]?.subcategoria || ''} className='input-form-edicion' {...register("subcategoria")} />
                  </div>
                  <button type='submit' className='btn-editar-submit'>Actualizar</button>
                </form>
              </div>
            </div>
            <div className='activities'>
              <SimpleLineChat dataProduct={countSales}/>
            </div>
          </section>
        </div>
    </>
  )
}

export default EditarProducto