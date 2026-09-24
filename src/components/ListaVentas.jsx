import React from 'react';

function ListaVentas({
  ventas = [],
  cargando,
  handleEditar,
  handleEliminar,
  formatMoneda
}) {
  return (
    <div className="lista-ventas-container">
      <h2>Lista de Ventas Registradas</h2>

      {cargando ? (
        <p className="loading-text">Cargando ventas...</p>
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
            {Array.isArray(ventas) && ventas.length > 0 ? (
              ventas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.estudiante || venta.estudiante_nombre || 'N/A'}</td>
                  <td>{venta.producto || venta.producto_nombre || 'N/A'}</td>
                  <td>{venta.cantidad}</td>
                  <td>{formatMoneda ? formatMoneda(venta.precio) : venta.precio}</td>
                  <td>
                    {formatMoneda
                      ? formatMoneda(venta.total || venta.precio * venta.cantidad)
                      : venta.total}
                  </td>
                  <td>
                    {venta.fecha
                      ? new Date(venta.fecha).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="acciones-cell">
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
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  No hay ventas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListaVentas;