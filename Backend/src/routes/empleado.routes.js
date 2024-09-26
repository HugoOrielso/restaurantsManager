import { Router } from 'express'
import { crearPedido, editarPedido, finalizarOrden, inicioSesionEmpleados, obtenerMesas, obtenerPedido, obtenerPedidosEnCurso, obtenerProductos, pedidosEnCursoCocineros, pedidosEnCursoCocinerosPizzero, crearPedidoRecepcion, allOrdersInCourse, obtenerPedidoRecepcionista, finalizarOrdenRecepcion, domiciliosEnCurso, tomarPedido, misDomicilios, finalizarOrdenDomicilio, liberarOrden, entregarPedidoMesa, reporteDomicilios, reporteGeneral, cancelarOrden } from '../controllers/empleadosControlador.js'

import { auth } from '../middlewares/auth.js'
const router = Router()

router.post('/crearPedido', auth, crearPedido)
router.post('/crearPedido/recepcion', auth, crearPedidoRecepcion)
router.get('/allOrders', auth, allOrdersInCourse)
router.post('/', inicioSesionEmpleados)
router.get('/', auth, obtenerProductos)
router.post('/obtenerDomicilios/:estado', obtenerPedidosEnCurso)
router.get('/obtenerMesas', obtenerMesas)
router.get('/obtenerPedido/:mesa', auth, obtenerPedido)
router.put('/editarPedido', auth, editarPedido)
router.post('/finalizar/:mesa', auth, finalizarOrden)
router.get('/pedidosEnCursoCocineros', auth, pedidosEnCursoCocineros)
router.get('/pedidosEnCursoCocineros/pizzero', auth, pedidosEnCursoCocinerosPizzero)
router.get('/recepcionista/:id', auth, obtenerPedidoRecepcionista)
router.get('/recepcionista/finalizar/:id', auth, finalizarOrdenRecepcion)
router.get('/domicilios', auth, domiciliosEnCurso)
router.post('/domicilios', auth, tomarPedido)
router.get('/misDomicilios', auth, misDomicilios)
router.post('/domicilios/finalizar', auth, finalizarOrdenDomicilio)
router.post('/domicilios/liberar', auth, liberarOrden)
router.put('/pedidosEnCursoCocineros/:id', auth, entregarPedidoMesa)
router.get('/reporte/domicilios', auth, reporteDomicilios)
router.get('/reporte/general', auth, reporteGeneral)
router.delete('/cancelar/:id', auth, cancelarOrden)

export default router
