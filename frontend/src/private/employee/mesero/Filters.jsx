import React, { useId, useState } from 'react'
import '../../../../public/css/productos.css'
const Filters = ({onChange}) => { 
  const [busqueda, setBusqueda]= useState("")
  const busquedaFilterId = useId()
  const categoriaFilterId = useId()

  const handleChangeBusqueda = (e)=>{
    setBusqueda(e.target.value)
    onChange(prevState=>({
      ...prevState,
      busqueda: e.target.value
    }))
  }

  const handleChangeCategoria=(e)=>{
    onChange(prevState=>({
      ...prevState,
      category: e.target.value
    }))

  }
  return (
    <section className='filters-venecia'>
      <div className='div-busqueda'>
        <input type="search" id={busquedaFilterId} className='input-filter busqueda' placeholder='Buscar por nombre' onChange={handleChangeBusqueda}/>
      </div>
      <div>
        <select name="" id={categoriaFilterId} className='input-filter' onChange={handleChangeCategoria}> 
          <option value="all">Todos los productos</option>
          <option value="hamburguesas">Hamburguesas</option>
          <option value="bebidas">Bebidas</option>
          <option value="pizzas">Pizzas</option>
          <option value="perros">Perros</option>
        </select>
      </div>
    </section>
  )
}

export default Filters