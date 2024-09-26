import React from 'react'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Inicio from '../components/Inicio'
import { useLocalStorage } from 'react-use'
import ProteccionPublica from '../utils/ProteccionPublica'
import Administracion from '../private/propietario/Administracion'
import PropietarioProteccion from '../utils/PropietarioProteccion'
import Gastos from '../private/propietario/Gastos'
import Ingresos from '../private/propietario/Ingresos'
import Balance from '../private/propietario/Balance'
import RegistroEmpleado from '../private/propietario/RegistroEmpleado'
import Empleado from '../components/Empleado'
import MeseroProteccion from '../utils/MeseroProteccion'
import InicioMesero from '../private/employee/mesero/InicioMesero'
import CrearPedido from '../private/employee/mesero/CrearPedido'
import ActualizarPedido from '../private/employee/mesero/ActualizarPedido'
import RecepcionistaProteccion from '../utils/RecepcionistaProteccion'
import CocineroProteccion from '../utils/CocineroProteccion'
import InicioCocinero from '../private/employee/cocinero/InicioCocinero'
import InicioRecepcionista from '../private/employee/recepcionista/InicioRecepcionista'
import Inventario from '../private/propietario/Inventario'
import EditarProducto from '../private/propietario/EditarProducto'
import PizzeroInicio from '../private/employee/cocinero/PizzeroInicio'
import PedidosEnCursoRecepcionista from '../private/employee/recepcionista/PedidosEnCursoRecepcionista'
import PedidoEnCursoDetalle from '../private/employee/recepcionista/PedidoEnCursoDetalle'
import DomiciliarioProteccion from '../utils/DomiciliarioProteccion'
import InicioDomicioliarios from '../private/employee/domiciliario/InicioDomicioliarios'
import MisDomicilios from '../private/employee/domiciliario/MisDomicilios'
import ReporteDelDia from '../private/employee/recepcionista/ReporteDelDia'
import ReporteDomicilios from '../private/employee/recepcionista/ReporteDomicilios'
import RevisarPedidosEnCurso from '../private/propietario/RevisarPedidosEnCuso'

const Routing = () => {
  const [ propietario ] = useLocalStorage("propietario")
  const [ mesero ] = useLocalStorage("mesero")
  const [ recepcionista ] = useLocalStorage("recepcionista")
  const [ cocinero ] = useLocalStorage("cocinero")
  const [ domiciliario ] = useLocalStorage("domiciliario")
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProteccionPublica activate={propietario || mesero || cocinero || recepcionista || domiciliario}/>}>
          <Route path='/' element={<Inicio/>}/>
          <Route path='/empleado' element={<Empleado/>}/>
        </Route>

        <Route element={<MeseroProteccion activate={mesero}/>}>
          <Route path='/inicioMesero' element={<InicioMesero/>}/>
          <Route path='/mesa/:numeroDeMesa' element={<CrearPedido/>}/>
          <Route path='/actualizar/:mesaOcupada' element={<ActualizarPedido/>}/>
        </Route>
          <Route element={<PropietarioProteccion activate={propietario}/>}>
            <Route path='/administracion/inicio' element={<Administracion/>}/>
            <Route path='/administracion/gastos' element={<Gastos/>}/>
            <Route path='/administracion/ingresos' element={<Ingresos/>}/>
            <Route path='/administracion/balance' element={<Balance/>}/>
            <Route path='/administracion/empleado' element={<RegistroEmpleado/>}/>
            <Route path='/administracion/inventario' element={<Inventario/>}/>
            <Route path='/administracion/pedidosEnCurso' element={<RevisarPedidosEnCurso/>}/>
            <Route path='/administracion/editarProducto/:id' element={<EditarProducto/>}/>
          </Route>

        <Route element={<CocineroProteccion activate={cocinero}/>}>
          <Route path='/inicioCocineros' element={<InicioCocinero/>}/>
          <Route path='/inicioCocineros/pizzero' element={<PizzeroInicio/>}/>
        </Route>

        <Route element={<RecepcionistaProteccion activate={recepcionista}/>}>
          <Route path='/inicioRecepcionistas' element={<InicioRecepcionista/>}/>
          <Route path='/pedidosEnCurso' element={<PedidosEnCursoRecepcionista/>}/>
          <Route path='/pedidosEnCurso/:id' element={<PedidoEnCursoDetalle/>}/>
          <Route path='/reporte' element={<ReporteDelDia/>}/>
          <Route path='/reporteDomicilios' element={<ReporteDomicilios/>}/>
        </Route>

        <Route element={<DomiciliarioProteccion activate={domiciliario} />} >
          <Route  path='/inicioDomiciliarios' element={<InicioDomicioliarios/>} />
          <Route  path='/misDomicilios' element={<MisDomicilios/>} />
        </Route>



      </Routes>
    </BrowserRouter>
  )
}

export default Routing