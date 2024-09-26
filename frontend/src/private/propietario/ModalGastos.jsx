/* eslint-disable react/prop-types */
import React from 'react'
import { useForm } from 'react-hook-form'
import { customAxios } from '../../../interceptors/axios.interceptor'
import { toast } from 'sonner'

const ModalGastos = ({abrir}) => {
    const {register , handleSubmit, formState : {errors}, reset} = useForm({})
    async function nuevoGasto (e){
        const request = await customAxios.post("propietario/gastos",
            {monto:e.monto, descripcion:e.descripcion},
            {
            headers: {
                "content-type": "application/json",
                "Authorization": localStorage.getItem("token")
            },
            withCredentials:true
        })
        if(request.data.status=="success"){
            toast.success("Gasto agregado correctamente.")
            // location.reload()
            reset()
        }
    }
  return (
    <>
        <section className='modal-gasto'>
            <div className='modal'>
                <h2 className='title-add-gasto'>Registrar gastos</h2>

                <form onSubmit={handleSubmit(nuevoGasto)} className='form-gastos'>
                    <button onPointerDown={()=>{abrir(false)}} className='close-modal'>X</button>
                    <div className='gasto-div'>
                        <label htmlFor="monto" className='label-gasto'>Precio</label>
                        <input type="text" id="monto" {...register("monto", {required: "El campo es obligatorio", pattern: {value: /^\d+$/, message: "Sólo se aceptan números"} })} className={`monto ${errors.monto ? "error-input":""}`}  placeholder='Precio'/>
                    </div>
                    <div className='gasto-div'>
                        <label htmlFor="descripcion" className='label-gasto'>Detalle del gasto</label>
                        <textarea name="descripcion" className={`textarea ${errors.descripcion ? "error-input":""}`} {...register("descripcion", {required: "El campo es obligatorio", pattern: {value: /^[a-zA-Z]+$/ , message: "Sólo se aceptan letras"} })} placeholder='Descripción'/>
                    </div>
                    <div className='container-botones-modal-gasto'>
                        <button type='submit' className='btn-agregar'>Registrar</button>
                    </div>
                </form>
            </div>
        </section>
    </>
  )
}



export default ModalGastos