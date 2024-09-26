import moment from 'moment'
import { tokenSecret } from '../config.js';
import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
  const {refresh_token, acces_token} = req.cookies
  
  if (!refresh_token || !acces_token) {
    return res.status(403).json({
      status: 'error',
      message: 'No estás autorizado a realizar esta petición'
    })
  }
  const token = acces_token.replace(/['"]+/g, '')
  try {
    const payload = jwt.decode(token, tokenSecret)
    if (payload.exp <= moment().unix()) {
      throw new Error('Token vencido')
    }
    req.user = payload
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      message: 'Token inválido'
    })
  }
  next()
}
