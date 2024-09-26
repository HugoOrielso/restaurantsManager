import { Router } from 'express'
import { crearCuenta, registroPropietario, iniciarSesion } from '../controllers/administradorControlador.js'
import { auth } from '../middlewares/auth.js'

const router = Router()

router.post('/registroPropietario', auth, registroPropietario)
router.post('/', crearCuenta)
router.post('/login', iniciarSesion)

export default router
