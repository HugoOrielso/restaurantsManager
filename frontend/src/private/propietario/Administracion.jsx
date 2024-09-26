/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import AsideOwner from './AsideOwner';
import '../../../public/css/owner.css';
import NavBarOwner from './NavBarOwner';
import { Control } from './IconsNav';
import ChartBox from './ChartBox';
import TodosLosUsuarios from './TodosLosUsuarios';
import MaxVentas from './MaxVentas';
import { customAxios } from '../../../interceptors/axios.interceptor';

const Administracion = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [allPedidos, setAllPedidos] = useState([]);
  const fetchAllUsersInDb = async () => {
    try {
      const request = await customAxios.get('propietario/usuariosDisponibles', {
        headers: {
          'content-type': 'application/json',
        },
        withCredentials:true
      });
      
      if (request.data.status === 'success') {
        setAllUsers(request.data.usuarios);
      }
    } catch (error) {
      
    }

  };

  const fetchTodosLosPedidos = async () => {
    const request = await customAxios.get('propietario/todosLosPedidos', {
      headers: {
        'content-type': 'application/json',
      },
      withCredentials: true 
    });
    if (request.data.status === 'success') {
      setAllPedidos(request.data.pedidos);
    }
  };

  useEffect(() => {
    fetchAllUsersInDb();
    fetchTodosLosPedidos();
  }, []);

  let totalPedidos = 0;
  allPedidos.forEach((element) => {
    totalPedidos += element.total_pedidos;
  });


  return (
    <>
      <NavBarOwner />
      <section className="wrapper"  >
        <AsideOwner />
        <main >
          <section className="estadisticas">
            <div className="box box1">
              <h1 className="estadistical-h1">Usuarios</h1>
              <div className="list-users">
                <TodosLosUsuarios allUsers={allUsers} />
              </div>
            </div>
            <div className="box box2">
              <span>
                <strong>Controla tu negocio con un solo toque</strong>
              </span>
              <Control />
            </div>
            <div className="box box3">
              <MaxVentas />
            </div>
            <div className="box box4" style={{ placeContent: 'center', display: 'grid' }}>
              Ten control total de lo que hacen los usuarios ✅.
            </div>
            <div className="box box5" style={{ placeContent: 'center', display: 'grid' }}>
              Administra tu negocio al alcance de un clic ✅.
            </div>
            <div className="box box6">
              <ChartBox allPedidos={allPedidos} />
            </div>
            <div className="box box7">
              <h3>Estos han sido la cantidad de pedidos en los últimos 7 días</h3>
              <span className="totalPedidoCircle">1</span>
            </div>
          </section>
        </main>
      </section>
    </>
  );
};

export default Administracion;
