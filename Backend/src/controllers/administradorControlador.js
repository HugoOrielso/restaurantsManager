import bcrypt from 'bcrypt'
import { createToken } from '../services/jwt.js'
import { conection } from '../database/conecction.js'

export async function registroPropietario (req, res) {
  const params = req.body
  const user = req.user
  if (!params.email || !params.password || !params.rol || !params.nombre) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos por enviar'
    })
  }
  if (user.rol !== 1) {
    return res.status(401).json({
      status: 'error',
      message: 'No puedes realizar esta acción'
    })
  }
  try {
    const pwd = await bcrypt.hash(params.password, 10)
    params.password = pwd
    const [resul] = await conection.query('SELECT * FROM propietario WHERE email = ?', [params.email])
    if (resul.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'El usuario existe en la base de datos'
      })
    }
    const [query] = await conection.query('INSERT INTO propietario (name, email, password, rol) VALUES(?,?,?,?)', [params.nombre, params.email, params.password, params.rol])
    if (query.insertId) {
      return res.status(200).json({
        status: 'success',
        message: 'Usuario almacenado correctamente'
      })
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Ocurrió un error en la consulta'
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor'
    })
  }
}

export async function crearCuenta (req, res) {
  const params = req.body
  if (!params.email || !params.password || !params.nombre || !params.rol) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos por enviar'
    })
  }
  try {
    const pwd = await bcrypt.hash(params.password, 10)
    params.password = pwd
    const [resul] = await conection.query('SELECT * FROM usuario WHERE email = ?', [params.email])
    if (resul.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'El usuario existe en la base de datos'
      })
    }
    const [query] = await conection.query('INSERT INTO usuario (name, email, password, rol) VALUES(?,?,?,?)', [params.nombre, params.email, params.password, params.rol])
    if (query.insertId) {
      return res.status(200).json({
        status: 'success',
        message: 'Usuario almacenado correctamente'
      })
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Ocurrió un error en la consulta'
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor'
    })
  }
}

export async function iniciarSesion (req, res) {
  const params = req.body
  if (!params.email || !params.password) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos por enviar'
    })
  }
  try {
    const [result] = await conection.query('SELECT * FROM usuario WHERE email = ?', [params.email])
    if (result.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El usuario no existe en la base de datos'
      })
    }
    const compare = bcrypt.compareSync(params.password, result[0].password)
    if (!compare) {
      return res.status(400).json({
        status: 'error',
        message: 'Contraseña incorrecta'
      })
    }
    const token = createToken(result[0])
    return res.status(200).json({
      status: 'success',
      message: 'Identificado correctamente',
      administrador: {
        id: result[0].identification,
        nombre: result[0].name,
        rol: result[0].rol
      },
      token
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}
