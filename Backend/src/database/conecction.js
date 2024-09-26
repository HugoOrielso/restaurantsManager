import { createConnection } from 'mysql2/promise'

export const conection = await createConnection({
  database: 'pizzeria_venecia',
  host: 'localhost',
  user: 'root',
  password: '',
  port: '3306 '
},
console.log('Conectado a la base de datos')
)
