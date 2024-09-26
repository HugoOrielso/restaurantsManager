import React from 'react'
import Nav from './Nav'
import {useForm} from 'react-hook-form'
import'../../public/css/inicio.css'
import { Toaster, toast } from 'sonner'
import { customAxios } from '../../interceptors/axios.interceptor'
const Inicio = () => {

  const {register ,handleSubmit , formState: {errors}} = useForm({})
  async function login(e) {
    try {
      const request = await customAxios.post("propietario",{email:e.email, password: e.password}, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true 
      });
  
      if (request.data.status === "success") {
        toast.success("Inicio de sesión exitoso");
        localStorage.setItem("propietario", JSON.stringify(request.data.propietario));
        setTimeout(() => {
          location.reload()
        }, 2000);
        return;
      }
    } catch (error) {
      toast.error("No se pudo iniciar sesión");
    }
  }
  


  return (
    <>
      <Nav />
      <main className='main-inicio'>
      <section className='container-form'>
        <form onSubmit={handleSubmit(login)} className='formulario-login'>
            <h1 style={{textTransform: "uppercase"}}>Iniciar sesión</h1>
            <div className='container-campos'>
              <label htmlFor="usuario"><strong>Usuario</strong> </label>
              <input type="text" id='usuario' {...register("email",{required: "Este campo es obligatorio", pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/i,
              message: 'Ingrese un correo electrónico válido',
              }})} className={`input-form ${errors.email ? "error-input" : ""}`}/>
            </div>
            <div className='container-campos'>
              <label htmlFor="password"> <strong>Contraseña</strong> </label>
              <input type="password" id='password' {...register("password", {required: "Este campo es obligatorio"})} className={`input-form ${errors.password ? "error-input":""}`}/>
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

export default Inicio