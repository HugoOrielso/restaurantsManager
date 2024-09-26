/* eslint-disable no-unused-vars */
import React from 'react'
import Nav from './Nav'
import { useForm } from 'react-hook-form'
import { Toaster , toast } from 'sonner'
import io from 'socket.io-client'
import { customAxios } from '../../interceptors/axios.interceptor'
const Empleado = () => {
    const socket = io("/")
    const {register,handleSubmit,formState:{errors}} = useForm({})

    async function login(e){
        try {
            const request = await customAxios.post("empleado" ,{email: e.email, password: e.password},{
                headers:{
                    "content-type": "application/json"
                },
                withCredentials: true
            })
            if(request.data.status=="success"){
                toast.success("Inico de sesión exitoso")
                if(request.data.mesero){
                    localStorage.setItem("mesero", JSON.stringify(request.data.mesero))
                    socket.emit("login", (request.data.mesero.nombre))
                }
                
                if(request.data.domiciliario){
                    localStorage.setItem("domiciliario", JSON.stringify(request.data.domiciliario))
                    socket.emit("login", (request.data.domiciliario.nombre))
                }

                if(request.data.recepcionista){
                    localStorage.setItem("recepcionista", JSON.stringify(request.data.recepcionista))
                    socket.emit("login", (request.data.recepcionista.nombre))
                }

                if(request.data.cocinero){
                    localStorage.setItem("cocinero", JSON.stringify(request.data.cocinero))
                    socket.emit("login", (request.data.cocinero.nombre))
                }
                setTimeout(()=>{
                    location.reload()
                },2000)
            }
        } catch (error) {
            toast.error("No se pudo iniciar sesión, intenta nuevamente.")
        }
    }
  return (
    <>
        <Nav/>
        <main className='main-inicio'>
            <section className='container-form'>
              <form onSubmit={handleSubmit(login)} className='formulario-login'>
                  <h1 style={{textTransform: "uppercase"}}>Iniciar sesión</h1>
                  <div className='container-campos'>
                    <label htmlFor="usuario"><strong>Email</strong> </label>
                    <input type="text" id='usuario' {...register("email", {required: "El campo es obligatorio", pattern: {
                        value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/i,
                        message: 'Ingrese un correo electrónico válido',
                    }})} className={`input-form ${errors.email ? "error-input" : ""}`}/>
                  </div>
                  <div className='container-campos'>
                    <label htmlFor="password"> <strong>Contraseña</strong> </label>
                    <input type="password" id='password' {...register("password", {required: "El campo es obligatorio",minLength: {value: 8, message: 'La contraseña debe tener al menos 8 caracteres'}})} className={`input-form ${errors.password ? "error-input":""}`}/>
                  </div>
                  <button type='submit'>Enviar</button>
              </form>
              <div>
                <p>¿Aún no tienes una cuenta?, comunícate con el propietario</p>
              </div>
            </section>
        </main>
        <Toaster richColors/>
    </>
  )
}

export default Empleado