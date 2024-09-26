import { Router } from 'express'
import { allPedidosGroups, allUsers, countSalesProducts, crearEmpleado, editarProducto, eliminarProducto, gastos, iniciarSesionPropietario, inventario, obtenerGanancias, productosDisponibles, productosMasVendidos, prueba, registrarGasto, registrarProducto, singleProdcut } from '../controllers/propietarioControlador.js'
import { auth } from '../middlewares/auth.js'

const router = Router()

router.post('/', iniciarSesionPropietario)
router.post('/prueba', prueba)
router.get('/gastos', auth, gastos)
router.post('/gastos', auth, registrarGasto)
router.post('/crearEmpleado', auth, crearEmpleado)
router.get('/ganancias', auth, obtenerGanancias)
router.get('/productosDisponibles', auth, productosDisponibles)
router.get('/usuariosDisponibles', auth, allUsers)
router.get('/todosLosPedidos', auth, allPedidosGroups)
router.get('/productosMasVendidos', auth, productosMasVendidos)
router.get('/productos', auth, inventario)
router.post('/productos', auth, registrarProducto)
router.get('/singleProduc/:id', auth, singleProdcut)
router.get('/producto/:id', auth, countSalesProducts)
router.put('/producto/:id', auth, editarProducto)
router.delete('/producto/:id', auth, eliminarProducto)

export default router
