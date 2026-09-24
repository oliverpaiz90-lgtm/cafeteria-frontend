import React from 'react';

function ListaVentas({ ventas, cargando, handleEditar, handleEliminar, formatMoneda }) {
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
                    className="btn-editar" 
                    onClick={() => handleEditar && handleEditar(venta)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-eliminar" 
                    onClick={() => handleEliminar && handleEliminar(venta.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListaVentas;