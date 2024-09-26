config()
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { config } from 'dotenv'
import { refreshSecret, tokenSecret } from '../config.js'


export const createToken = (user) => {
  if (user.subRol) {
    const payload = {
      id: user.identification,
      name: user.name,
      email: user.email,
      rol: user.rol,
      subRol: user.subRol,
      iat: moment().unix(),
    }
  }
  const payload = {
    id: user.identification,
    name: user.name,
    email: user.email,
    rol: user.rol,
    iat: moment().unix(),
  }
  return jwt.sign(payload, tokenSecret, {expiresIn:"20s"})
}


export const createRefreshToken = (user) => {
  if (user.subRol) {
    const payload = {
      id: user.identification,
      name: user.name,
      email: user.email,
      rol: user.rol,
      subRol: user.subRol,
      iat: moment().unix(),
      exp: moment().add(30, 'days').unix()
    }
  }
  const payload = {
    id: user.identification,
    name: user.name,
    email: user.email,
    rol: user.rol,
    iat: moment().unix(),
  }
  return jwt.sign(payload, refreshSecret, {expiresIn:"1d"})
}