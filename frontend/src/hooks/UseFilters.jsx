import React, { useState } from 'react'

export const UseFilters = () => {
  const [filters, setFilters] = useState({
    category: "all",
    busqueda: "hamburguesa"
  })

  const filterProducts = (products)=>{
    return products.filter(product=>{
      return(
        filters.category == "all" || product.categoria == filters.category,
        filters.busqueda = "all" || product.nombre.toLowerCase().includes(filters.busqueda.toLowerCase())
      )
    })
  }
  return {filterProducts , setFilters}
}
