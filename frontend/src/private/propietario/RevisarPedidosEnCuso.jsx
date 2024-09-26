import React from 'react'
import NavBarOwner from './NavBarOwner'
import AsideOwner from './AsideOwner'
import Curso from './Curso'

const RevisarPedidosEnCurso = () => {
  return (
    <>
        <NavBarOwner/>
        <section className='wrapper'>
            <AsideOwner/>
            <main>
              <Curso/>
            </main>
        </section>
    </>
  )
}

export default RevisarPedidosEnCurso