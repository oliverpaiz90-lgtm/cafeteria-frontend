import React, { useEffect, useState } from 'react';
import { api } from '../api';
import EditarVenta from './EditarVenta';

function ListaVentas() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarVentas = () => {
    setCargando(true);
    api.get('/ventas')
      .then(res => setVentas(res.data))
      .catch(err => console.error('Error al obtener ventas:', err))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const eliminarVenta = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta venta?')) {
      api.delete(`/ventas/${id}`)
        .then(res => {
          alert(res.data.message || 'Venta eliminada');
          if (ventaSeleccionada?.id === id) setVentaSeleccionada(null);
          cargarVentas();
        })
        .catch(err => {
          console.error('Error al eliminar venta:', err);
          alert('No se pudo eliminar la venta');
        });
    }
  };

  const formatMoneda = (valor) => {
    return new Number(valor).toLocaleString('es-SV', {
      style: 'currency',
      currency: 'USD'
    });
  };

  return (
    <div className="lista-ventas-container">
      <h2>Lista de Ventas Registradas</h2>

      {cargando ? (
        <p>Cargando ventas...</p>
      ) : (
        <table className="tabla-ventas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Estudiante</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{venta.estudiante}</td>
                <td>{venta.producto}</td>
                <td>{venta.cantidad}</td>
                <td>{formatMoneda(venta.precio)}</td>
                <td>{formatMoneda(venta.total)}</td>
                <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => setVentaSeleccionada(venta)}
                    className="btn-editar"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => eliminarVenta(venta.id)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {ventaSeleccionada && (
        <EditarVenta
          venta={ventaSeleccionada}
          onUpdate={() => {
            setVentaSeleccionada(null);
            cargarVentas();
          }}
          onCancel={() => setVentaSeleccionada(null)}
        />
      )}
    </div>
  );
}

export default ListaVentas;