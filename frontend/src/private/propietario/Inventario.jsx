import React, { useEffect, useState } from 'react'
import NavBarOwner from './NavBarOwner'
import AsideOwner from './AsideOwner'
import TableInventarioDos from './tables/TableInventarioDos'
import '/public/css/transitionView.css'
import Agregar from './Agregar'
import { Toaster } from 'sonner'
import { customAxios } from '../../../interceptors/axios.interceptor'

const Inventario = () => {
  const [open,setOpen]=useState(false)
  const [inventario, setInventario] = useState([])
  async function inventarioDb(){
    const request = await customAxios.get('propietario/productos', {
      headers: {
        "content-type":"application/json",
        "Authorization": localStorage.getItem("token")
      },
      withCredentials:true
    })
    if(request.data.status=="success"){
      setInventario(request.data.rows)
    }
  }
  useEffect(()=>{
    inventarioDb()
  },[])
  return (
    <>
      <NavBarOwner/>
      <section className='wrapper'>
        <AsideOwner/>
        <section className='container-table-inventario'>
        <div className='container-add'>
          <h3>Productos</h3>
          <button onClick={()=>setOpen(true)} className='add-product'>Agregar un producto</button>
        </div>
          <TableInventarioDos inventario={inventario}/>
          {open && <Agregar setOpen={setOpen}/>}
        </section>
      </section>
      <Toaster richColors/>
    </>
  )
}

export default Inventario