import React from 'react'
import { useForm } from 'react-hook-form'
import { Global } from '../../helpers/Helpers'
const AdminInicio = () => {
    const {register, handleSubmit} = useForm({})
    async function inicioSesion(data){
        let adminRegistro = data
        const request = await fetch(Global.url + "/admin", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(adminRegistro)
        })
        const result = await request.json()
    }
  return (
    <div>
        <form onSubmit={handleSubmit(inicioSesion)}>
            <input type="text" placeholder='nombre' {...register("nombre")} />
            <input type="text" placeholder='contraseña' {...register("password")}/>
            <input type="text" placeholder='email' {...register("email")}/>
            <button >Enviar</button>
        </form>
    </div>
  )
}

export default AdminInicio