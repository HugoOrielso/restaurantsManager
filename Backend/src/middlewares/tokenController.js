import jwt from 'jsonwebtoken'
import { refreshSecret, tokenSecret } from '../config.js'
import { config } from 'dotenv'
import moment from 'moment'
config()

export async function refreshTokenController(req,res,next){
    const { refresh_token } = req.cookies
    try {
        if(!refresh_token){
            return res.status(401).json({
                status: "error",
                message: "No estás autorizado para realizar esta petición"
            })
        }

        if(jwt.verify(refresh_token,refreshSecret)){
            const user = jwt.decode(refresh_token,refreshSecret)

            const token = jwt.sign({name: user.name, email: user.email, rol: user.rol, iat: moment().unix()},tokenSecret,{expiresIn: "1d"})
            
            const refreshToken = jwt.sign({name: user.name, email: user.email, rol: user.rol, iat: moment().unix()},refreshSecret,{expiresIn: "2d"})

            res.cookie('acces_token', token, {httpOnly:true, secure: process.env.NODE_ENV === 'production', path: 'http://localhost:5173'})

            res.cookie('refresh_token', refreshToken, {httpOnly:true, secure: process.env.NODE_ENV === 'production', path: 'http://localhost:5173'})

            res.json({
              status: 'success',
              message: 'Identificado correctamente',
              propietario: {
                id: user.identification,
                nombre: user.name,
                rol: user.rol
              }
            })
        }
    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "No se pudo hacer refresh, inicia sesión nuevamente."
        })
    }
    next()
}