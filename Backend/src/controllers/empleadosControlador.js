import { compareSync } from 'bcrypt'
import { createRefreshToken, createToken } from '../services/jwt.js'
import { conection } from '../database/conecction.js'

export async function crearPedido (req, res) {
  const object = req.body
  const { observaciones } = req.body
  const numMesa = object.numeroDeMesa.numeroDeMesa
  const { mesero } = req.body
  const productos = req.body.productos
  if (!observaciones || !numMesa || !productos) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos por enviar'
    })
  }
  try {
    const [[{ ocupada }]] = await conection.query('SELECT ocupada FROM mesas WHERE mesa = ?', [numMesa])
    if (ocupada !== 1) {
      return res.status(400).json({
        status: 'error',
        message: 'No se pudo crear el pedido'
      })
    }
    const [consulta] = await conection.query('UPDATE mesas SET ocupada = ? WHERE mesa = ?', [2, numMesa])
    if (consulta.affectedRows !== 1) {
      throw new Error('No se pudo crear el pedido')
    }
    const tipe = 'mesa'
    const state = 'en preparacion'
    const [query] = await conection.query('INSERT INTO pedidos (tipo, mesa, estado, pago, total, observaciones,usuario_encargado) VALUES (?,?,?,?,?,?,?)', [tipe, numMesa, state, object.metodoDePago, object.totalPrice, observaciones, mesero])
    const inserId = query.insertId
    productos.forEach(async producto => {
      const total = (producto.precio * producto.quantity)
      const query = await conection.query('INSERT INTO detalles_pedido (id,producto_id,cantidad,precio_unitario,total) VALUES(?,?,?,?,?)', [inserId, producto.producto_id, producto.quantity, producto.precio, total])
    })
    return res.status(200).json({
      status: 'success',
      message: 'Pedido creado con éxito'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}

export async function crearPedidoRecepcion (req, res) {
  const object = req.body
  const productos = req.body.productos
  const { observaciones } = req.body
  const { vueltos } = req.body
  try {
    const tipe = 'domicilio'
    const state = 'en preparacion'
    const domiciliario = 'disponible'
    const [query] = await conection.query('INSERT INTO pedidos (tipo, direccion, estado, pago, total, usuario_encargado, observaciones, vueltos) VALUES (?,?,?,?,?,?,?,?)', [tipe, object.direccion, state, object.metodoDePago, object.totalPrice, domiciliario, observaciones, vueltos])
    const inserId = query.insertId
    productos.forEach(async producto => {
      const total = (producto.precio * producto.quantity)
      const query = await conection.query('INSERT INTO detalles_pedido (id,producto_id,cantidad,precio_unitario,total) VALUES(?,?,?,?,?)', [inserId, producto.producto_id, producto.quantity, producto.precio, total])
    })
    return res.status(200).json({
      status: 'success',
      message: 'Domicilio creado con éxito'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}

export async function obtenerProductos (req, res) {
  try {
    const [query] = await conection.query('SELECT * FROM productos')
    if (query.length === 0) {
      return res.status(204)
    }
    return res.status(200).json({
      status: 'success',
      message: 'Productos en base de datos',
      query
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un erro'
    })
  }
}

export async function inicioSesionEmpleados (req, res) {
  const params = req.body
  if (!params.email || !params.password) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos por enviar'
    })
  }
  try {
    const [query] = await conection.query('SELECT * FROM usuario WHERE email = ?', [params.email])
    if (query.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El usuario no existe en la base de datos'
      })
    }
    const compare = compareSync(params.password, query[0].password)
    if (!compare) {
      return res.status(400).json({
        status: 'error',
        message: 'Contraseña incorrecta'
      })
    }
    const token = createToken(query[0])
    const refreshToken = createRefreshToken(query[0])
    res.cookie('acces_token', token, {httpOnly:true, secure: process.env.NODE_ENV === 'production', path: 'http://localhost:5173'})
    res.cookie('refresh_token', refreshToken, {httpOnly:true, secure: process.env.NODE_ENV === 'production', path: 'http://localhost:5173'})
    if (query[0].sub_rol === 1) {
      return res.status(200).json({
        status: 'success',
        message: 'Identificado correctamente',
        cocinero: {
          nombre: query[0].name,
          rol: query[0].rol,
          subRol: query[0].sub_rol
        }
      })
    } else if (query[0].sub_rol === 2) {
      return res.status(200).json({
        status: 'success',
        message: 'Identificado correctamente',
        mesero: {
          nombre: query[0].name,
          rol: query[0].rol,
          subRol: query[0].sub_rol
        },
      })
    } else if (query[0].sub_rol === 3) {
      return res.status(200).json({
        status: 'success',
        message: 'Identificado correctamente',
        recepcionista: {
          nombre: query[0].name,
          rol: query[0].rol,
          subRol: query[0].sub_rol
        },
      })
    } else if (query[0].sub_rol === 4) {
      return res.status(200).json({
        status: 'success',
        message: 'Identificado correctamente',
        domiciliario: {
          nombre: query[0].name,
          rol: query[0].rol,
          subRol: query[0].sub_rol
        },
      })
    }

    
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}

export async function obtenerPedidosEnCurso (req, res) {
  try {
    const { estado } = req.params
    const [rows] = await conection.query('SELECT * FROM pedidos INNER JOIN detalles_pedido ON pedidos.id = detalles_pedido.id WHERE estado = ? ', [estado])
    if (rows.length === 0) {
      return res.status(204).json({})
    }
    return res.status(200).json({
      status: 'success',
      message: 'Pedidos en curso',
      rows
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}

export async function obtenerPedido (req, res) {
  const { mesa } = req.params
  try {
    const estado = 'en preparacion'
    const estadoDos = 'en mesa'
    const [[result]] = await conection.query('SELECT id, pago, estado, usuario_encargado FROM pedidos WHERE mesa = ? && (estado = ? || estado = ?);', [mesa, estado, estadoDos])
    const [rows] = await conection.query('SELECT detalles_pedido.id,detalles_pedido.cantidad, detalles_pedido.precio_unitario, productos.nombre, productos.categoria, productos.subcategoria FROM detalles_pedido INNER JOIN productos ON detalles_pedido.producto_id = productos.producto_id WHERE detalles_pedido.id = ?;', [result.id])
    if (rows.length === 0) {
      return res.status(204).json({})
    }
    return res.status(200).json({
      status: 'success',
      message: 'Pedido en curso',
      detalles_pedido: rows,
      estado: result.estado,
      metodoDePago: result.pago
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}

export async function obtenerMesas (req, res) {
  try {
    const [rows] = await conection.query('SELECT * FROM mesas')
    if (rows.length === 0) {
      return res.status(204).json({})
    }
    return res.status(200).json({
      status: 'success',
      message: 'Mesas disponibles',
      rows
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error'
    })
  }
}

export async function editarPedido (req, res) {
  try {
    const { observaciones } = req.body
    const estado = 'en mesa'
    const segundoEstado = 'en preparacion'
    let totalEnBd = 0
    const obj = req.body
    const mesa = obj.numeroDeMesa.mesaOcupada
    const products = obj.productos
    const [[{ id }]] = await conection.query('SELECT id from pedidos WHERE (mesa = ? && (estado = ? || estado = ?))', [mesa, estado, segundoEstado])
    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'El pedido no existe en la base de datos'
      })
    }

    products.forEach(async product => {
      const total = (product.precio * product.quantity)
      totalEnBd += total
      const [query] = await conection.query('INSERT INTO detalles_pedido (id,producto_id,cantidad,precio_unitario,total) VALUES(?,?,?,?,?)', [id, product.producto_id, product.quantity, product.precio, total])
      if (query.affectedRows === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Ocurrió un error insertando los productos'
        })
      }
    })

    const [[{ total }]] = await conection.query('SELECT total FROM pedidos WHERE id = ?', [id])
    if (!total) {
      return res.status(400).json({
        status: 'error',
        message: 'Ocurrió un error al crear el pedido'
      })
    }
    totalEnBd = (totalEnBd + parseFloat(total))
    const [priceInDB] = await conection.query('UPDATE pedidos SET total = ?, observaciones = ? WHERE id = ?',
      [totalEnBd, observaciones, id])
    if (!priceInDB.affectedRows > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Ocurrió un error actualizando el pedido'
      })
    }
    return res.status(200).json({
      status: 'success',
      message: 'Agregado con éxito'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error'
    })
  }
}

export async function finalizarOrden (req, res) {
  const { mesa } = req.params
  try {
    const estadoMesa = 'en mesa'
    const estado = 'finalizado'
    const user = req.user
    const [query] = await conection.query('SELECT * FROM pedidos WHERE mesa = ? && estado = ? ', [mesa, estadoMesa])
    if (query.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No hay pedido asignado a la mesa'
      })
    }
    if (query[0].estado !== estadoMesa) {
      return res.status(400).json({
        status: 'error',
        message: 'No puedes finalizar el pedido aún'
      })
    }

    const [actualizacion] = await conection.query('UPDATE pedidos SET estado = ? WHERE mesa = ?', [estado, mesa])

    if (actualizacion.affectedRows > 0) {
      const [actualizarMesa] = await conection.query('UPDATE mesas SET ocupada = ? WHERE mesa = ?', [1, mesa])
      if (actualizarMesa.affectedRows > 0) {
        return res.status(200).json({
          status: 'success',
          message: 'Finalizado exitosamente'
        })
      }
      return res.status(400).json({
        status: 'error',
        message: 'Ocurrió un error al actualizar la mesa'
      })
    }

    return res.status(400).json({
      status: 'error',
      message: 'No se pudo finalizar la orden'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error'
    })
  }
}

export async function pedidosEnCursoCocineros (req, res) {
  try {
    const estado = 'en preparacion'
    const [pedidos] = await conection.query("SELECT pedidos.observaciones, pedidos.id AS pedido_id, pedidos.tipo, pedidos.mesa, pedidos.pago, pedidos.estado, pedidos.direccion, detalles_pedido.precio_unitario, detalles_pedido.total, CONCAT(productos.nombre, ' x', detalles_pedido.cantidad) AS producto_cantidad, productos.categoria, productos.subcategoria FROM pedidos JOIN detalles_pedido ON pedidos.id = detalles_pedido.id JOIN productos ON detalles_pedido.producto_id = productos.producto_id WHERE  pedidos.estado = ?", [estado])
    if (pedidos.length === 0) {
      return res.status(200).json({
        status: 'vacío',
        message: 'Sin pedidos',
        pedidos: []
      })
    }
    return res.status(200).json({
      status: 'success',
      message: 'Pedidos en curso',
      pedidos
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}

export async function pedidosEnCursoCocinerosPizzero (req, res) {
  try {
    const estado = 'en preparacion'
    const [pedidos] = await conection.query("SELECT pedidos.observaciones, pedidos.id AS pedido_id, pedidos.tipo, pedidos.mesa, pedidos.pago, pedidos.estado, pedidos.direccion, detalles_pedido.precio_unitario, detalles_pedido.total, CONCAT(productos.nombre, ' x', detalles_pedido.cantidad) AS producto_cantidad, productos.categoria, productos.subcategoria, detalles_pedido.precio_unitario FROM pedidos JOIN detalles_pedido ON pedidos.id = detalles_pedido.id JOIN productos ON detalles_pedido.producto_id = productos.producto_id WHERE  ( productos.categoria = 'pizzas' OR EXISTS ( SELECT 1 FROM detalles_pedido dp JOIN productos p ON dp.producto_id = p.producto_id WHERE dp.id = pedidos.id AND p.categoria = 'pizzas' ) ) AND pedidos.estado = ?;", [estado])
    if (pedidos.length === 0) {
      return res.status(200).json({
        status: 'vacío',
        message: 'Sin pedidos',
        pedidos: []
      })
    }
    return res.status(200).json({
      status: 'success',
      message: 'Pedidos en curso',
      pedidosPizzas: pedidos
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}

export async function allOrdersInCourse (req, res) {
  try {
    const estado = 'finalizado'
    const [pedidos] = await conection.query("SELECT pedidos.observaciones, pedidos.id AS pedido_id, pedidos.usuario_encargado,pedidos.tipo, pedidos.mesa, pedidos.pago, pedidos.estado, pedidos.direccion, detalles_pedido.precio_unitario, detalles_pedido.total, CONCAT(productos.nombre, ' x', detalles_pedido.cantidad) AS producto_cantidad, productos.categoria, productos.subcategoria FROM pedidos JOIN detalles_pedido ON pedidos.id = detalles_pedido.id JOIN productos ON detalles_pedido.producto_id = productos.producto_id  WHERE pedidos.estado != ?;", [estado])
    if (pedidos.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Sin pedidos',
        pedidos: []
      })
    }
    return res.status(200).json({
      status: 'success',
      message: 'Pedidos en curso',
      pedidos
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un eror en la consulta'
    })
  }
}

export async function obtenerPedidoRecepcionista (req, res) {
  const { id } = req.params
  try {
    const estado = 'finalizado'
    const [rows] = await conection.query('SELECT pedidos.usuario_encargado, detalles_pedido.id,detalles_pedido.cantidad, detalles_pedido.precio_unitario, productos.nombre, productos.categoria, productos.subcategoria FROM detalles_pedido INNER JOIN productos ON detalles_pedido.producto_id = productos.producto_id INNER JOIN pedidos ON pedidos.id = detalles_pedido.id WHERE detalles_pedido.id = ? AND pedidos.estado != ?;', [id, estado])
    const [[infoAdicional]] = await conection.query("SELECT pedidos.usuario_encargado,pedidos.estado,pedidos.tipo, CASE WHEN pedidos.tipo = 'domicilio' THEN pedidos.direccion WHEN pedidos.tipo = 'mesa' THEN pedidos.mesa ELSE NULL END AS informacion_adicional  FROM pedidos WHERE pedidos.id = ? AND pedidos.estado != ?;", [id, estado])
    const [[{ pago }]] = await conection.query('SELECT pago from pedidos WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(204).json({})
    }
    return res.status(200).json({
      status: 'success',
      message: 'Pedidos en curso',
      detalles_pedido: rows,
      metodoDePago: pago,
      infoAdicional
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}

export async function finalizarOrdenRecepcion (req, res) {
  const { id } = req.params
  try {
    const [actualizacion] = await conection.query('UPDATE pedidos SET estado = ? WHERE mesa = ?', [estado, mesa])
    const [actualizarMesa] = await conection.query('UPDATE mesas SET ocupada = ? WHERE mesa = ?', [1, mesa])
    return res.status(200).json({
      status: 'success',
      message: 'Finalizado exitosamente'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error'
    })
  }
}

export async function domiciliosEnCurso (req, res) {
  try {
    const estado = 'en ruta'
    const tipe = 'domicilio'
    const domi = 'disponible'
    const [pedidos] = await conection.query("SELECT pedidos.id AS pedido_id, pedidos.tipo, pedidos.pago, pedidos.total, pedidos.estado, pedidos.direccion, detalles_pedido.precio_unitario, detalles_pedido.total, CONCAT(productos.nombre, ' x', detalles_pedido.cantidad) AS producto_cantidad, productos.categoria, productos.subcategoria FROM pedidos JOIN detalles_pedido ON pedidos.id = detalles_pedido.id JOIN productos ON detalles_pedido.producto_id = productos.producto_id WHERE (pedidos.estado = ? && pedidos.tipo = ? && pedidos.usuario_encargado = ?);", [estado, tipe, domi])
    if (pedidos.length === 0) {
      return res.status(200).json({
        status: 'vacío',
        message: 'Sin pedidos'
      })
    }
    return res.status(200).json({
      status: 'success',
      message: 'Domicilios en curso',
      domicilios: pedidos
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}

export async function tomarPedido (req, res) {
  const { email, name } = req.user
  const { idPedido } = req.body
  if (!email || !idPedido) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos por enviar'
    })
  }
  try {
    const [[user]] = await conection.query('SELECT * FROM usuario WHERE email = ?', [email])
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'El ususario no existe en la base de datos'
      })
    }
    if (user.sub_rol !== 4) {
      return res.status(400).json({
        status: 'error',
        message: 'No estás autorizado'
      })
    }
    const [row] = await conection.query('UPDATE pedidos SET pedidos.usuario_encargado = ? WHERE pedidos.id = ?', [name, idPedido])
    if (!row.affectedRows > 0) {
      return res.status(400).json({
        status: 'no tomado',
        message: 'No se pudo tomar el pedido'
      })
    }
    return res.status(200).json({
      status: 'success',
      message: 'Pedido tomado con éxito'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Error en la consulta'
    })
  }
}

export async function misDomicilios (req, res) {
  if (!req.user) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos por enviar'
    })
  }
  try {
    const [[user]] = await conection.query('SELECT * FROM usuario WHERE email = ?', [req.user.email])
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'El ususario no existe en la base de datos'
      })
    }
    if (user.sub_rol !== 4) {
      return res.status(400).json({
        status: 'error',
        message: 'No estás autorizado'
      })
    }
    const estado = 'en ruta'
    const tipe = 'domicilio'
    const [pedidos] = await conection.query("SELECT pedidos.id AS pedido_id, pedidos.tipo, pedidos.pago, pedidos.total, pedidos.estado, pedidos.direccion, detalles_pedido.precio_unitario, detalles_pedido.total, CONCAT(productos.nombre, ' x', detalles_pedido.cantidad) AS producto_cantidad, productos.categoria, productos.subcategoria FROM pedidos JOIN detalles_pedido ON pedidos.id = detalles_pedido.id JOIN productos ON detalles_pedido.producto_id = productos.producto_id WHERE pedidos.estado = ? && pedidos.tipo = ? && pedidos.usuario_encargado = ?;", [estado, tipe, req.user.name])
    if (pedidos.length === 0) {
      return res.status(200).json({
        status: 'vacío',
        message: 'Sin pedidos'
      })
    }
    return res.status(200).json({
      status: 'success',
      message: 'Domicilios en curso',
      domicilios: pedidos
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Error en la consulta'
    })
  }
}

export async function finalizarOrdenDomicilio (req, res) {
  const { idPedido } = req.body
  const {name} = req.user
  const estado = 'finalizado'
  if(!name || !idPedido){
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos por enviar.'
    })
  }
  try {
    const [actualizacion] = await conection.query('UPDATE pedidos SET pedidos.estado = ? WHERE pedidos.usuario_encargado = ? AND pedidos.id = ?', [estado, name, idPedido])
    if (!actualizacion.affectedRows) {
      return res.status(400).json({
        status: 'error',
        message: 'Ocurrió un error al finalizar la orden'
      })
    }
    return res.status(200).json({
      status: 'success',
      message: 'Finalizado exitosamente'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error'
    })
  }
}

export async function liberarOrden (req, res) {
  const { idPedido } = req.body
  const {name} = req.user

  if(!idPedido || !name){
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos por enviar'
    })
  }
  const estado = 'en ruta'
  const disponible = 'disponible'
  const actual = 'en ruta'
  try {
    const [actualizacion] = await conection.query('UPDATE pedidos SET pedidos.usuario_encargado = ?, pedidos.estado = ? WHERE pedidos.usuario_encargado = ? AND pedidos.id = ? && pedidos.estado = ?', [disponible, estado, name, idPedido, actual])
    if (!actualizacion.affectedRows > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Ocurrió un error al liberar la orden'
      })
    }
    return res.status(200).json({
      status: 'success',
      message: 'Liberado exitosamente'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error'
    })
  }
}

export async function entregarPedidoMesa (req, res) {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos por enviar'
    })
  }
  try {
    const [[{ tipo }]] = await conection.query('SELECT tipo FROM pedidos WHERE pedidos.id = ?;', [id])
    if (tipo === 'mesa') {
      const estado = 'en mesa'
      const [actualizar] = await conection.query('UPDATE pedidos SET estado = ? WHERE pedidos.id = ?;', [estado, id])
      if (!actualizar.affectedRows) {
        return res.status(400).json({
          stauts: 'error',
          message: 'Ocurrión un error al actualizar el pedido'
        })
      }
      return res.status(200).json({
        status: 'success',
        message: 'Entregado exitosamente'
      })
    } else if (tipo === 'domicilio') {
      const estado = 'en ruta'
      const [actualizar] = await conection.query('UPDATE pedidos SET estado = ? WHERE pedidos.id = ?;', [estado, id])
      if (!actualizar.affectedRows) {
        return res.status(400).json({
          stauts: 'error',
          message: 'Ocurrión un error al actualizar el pedido'
        })
      }
      return res.status(200).json({
        status: 'success',
        message: 'Entregado exitosamente'
      })
    }
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}

export async function reporteDomicilios (req, res) {
  try {
    const tipo = 'domicilio'
    const [rows] = await conection.query('SELECT pedidos.direccion, pedidos.fecha_pedido, pedidos.pago,pedidos.total,pedidos.vueltos,usuario.name FROM pedidos INNER JOIN usuario ON usuario.identification = pedidos.usuario_encargado WHERE pedidos.tipo = ? && fecha_pedido = CURDATE() OR fecha_pedido = CURDATE() - INTERVAL 1 DAY;', [tipo])
    if (rows.length === 0) {
      return res.status(200).json({
        status: 'vacío',
        message: 'Sin datos'
      })
    }
    return res.status(200).json({
      status: 'success',
      rows
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}

export async function reporteGeneral (req, res) {
  try {
    const [rows] = await conection.query('SELECT * FROM pedidos WHERE fecha_pedido = CURDATE() OR fecha_pedido = CURDATE() - INTERVAL 1 DAY;')
    if (rows.length === 0) {
      return res.status(200).json({
        status: 'vacío',
        message: 'Sin '
      })
    }
    return res.status(200).json({
      status: 'success',
      rows
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}

export async function cancelarOrden (req, res) {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos por enviar'
    })
  }
  try {
    const [[{ tipo }]] = await conection.query('SELECT tipo FROM pedidos WHERE id = ?;', [id])
    if (!tipo) {
      return res.status(400).json({
        status: 'error',
        message: 'No se puede cancelar el pedido'
      })
    }
    if (tipo === 'mesa') {
      const [[{ mesa }]] = await conection.query('SELECT mesa FROM pedidos WHERE id = ?', [id])
      if (!mesa) {
        return res.status(400).json({
          status: 'error',
          message: 'No se puede cancelar el pedido'
        })
      }
      const [query] = await conection.query('DELETE detalles_pedido,pedidos FROM pedidos LEFT JOIN detalles_pedido ON pedidos.id = detalles_pedido.id WHERE detalles_pedido.id = ?;', [id])
      if (query.affectedRows > 0) {
        const [query] = await conection.query('UPDATE mesas SET ocupada = ? WHERE mesa = ?;', [1, mesa])
        if (query.affectedRows > 0) {
          return res.status(200).json({
            status: 'success',
            message: 'Pedido cancelado con éxito',
            tipe: 'mesa'
          })
        }
      }
    } else if (tipo === 'domicilio') {
      const [query] = await conection.query('DELETE detalles_pedido,pedidos FROM pedidos LEFT JOIN detalles_pedido ON pedidos.id = detalles_pedido.id WHERE detalles_pedido.id = ?;', [id])
      if (query.affectedRows > 0) {
        return res.status(200).json({
          status: 'success',
          message: 'Pedido cancelado con éxito',
          tipe: 'domicilio'
        })
      }
      return res.status(400).json({
        status: 'error',
        message: 'No se pudo cancelar el pedido'
      })
    }
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un erro al cancelar el pedido'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Ocurrió un error en la consulta'
    })
  }
}
