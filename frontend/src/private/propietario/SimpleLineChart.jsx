  import React from 'react';
  import { BarChart ,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
  export const SimpleLineChat =({dataProduct})=> {
    return (
      <ResponsiveContainer width="100%" aspect={0}>
        <BarChart title='Cantidad de ventas del producto'  width={500} height={100} margin={{top:5 , right:5,bottom:5, left:5}} data={dataProduct}>
          <CartesianGrid strokeDasharray="4,1" />
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad_compras" fill="red" />
        </BarChart>
      </ResponsiveContainer>
      
    );
}
