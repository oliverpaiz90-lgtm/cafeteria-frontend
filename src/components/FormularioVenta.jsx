import React, { useState, useEffect } from 'react';

function FormularioVenta({
  estudiantes = [],
  productos = [],
  onGuardar,
  ventaAEditar,
  setVentaAEditar
}) {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    producto_id: '',
    cantidad: 1,
    fecha: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (ventaAEditar) {
      setFormData({
        estudiante_id: ventaAEditar.estudiante_id || '',
        producto_id: ventaAEditar.producto_id || '',
        cantidad: ventaAEditar.cantidad || 1,
        fecha: ventaAEditar.fecha
          ? new Date(ventaAEditar.fecha).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        estudiante_id: '',
        producto_id: '',
        cantidad: 1,
        fecha: new Date().toISOString().split('T')[0]
      });
    }
  }, [ventaAEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.estudiante_id || !formData.producto_id || formData.cantidad <= 0) {
      alert('Por favor complete todos los campos requeridos correctamente.');
      return;
    }

    onGuardar({
      ...formData,
      estudiante_id: Number(formData.estudiante_id),
      producto_id: Number(formData.producto_id),
      cantidad: Number(formData.cantidad)
    });

    setFormData({
      estudiante_id: '',
      producto_id: '',
      cantidad: 1,
      fecha: new Date().toISOString().split('T')[0]
    });
  };

  const handleCancelar = () => {
    if (setVentaAEditar) setVentaAEditar(null);
    setFormData({
      estudiante_id: '',
      producto_id: '',
      cantidad: 1,
      fecha: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="formulario-container">
      <h2>{ventaAEditar ? 'Editar Venta' : 'Registrar Nueva Venta'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Estudiante:</label>
          <select
            name="estudiante_id"
            value={formData.estudiante_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione un estudiante --</option>
            {Array.isArray(estudiantes) &&
              estudiantes.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.nombre}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label>Producto:</label>
          <select
            name="producto_id"
            value={formData.producto_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione un producto --</option>
            {Array.isArray(productos) &&
              productos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre} - ${prod.precio}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label>Cantidad:</label>
          <input
            type="number"
            name="cantidad"
            min="1"
            value={formData.cantidad}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-guardar">
            {ventaAEditar ? 'Actualizar' : 'Guardar'}
          </button>
          {ventaAEditar && (
            <button type="button" className="btn-cancelar" onClick={handleCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FormularioVenta;