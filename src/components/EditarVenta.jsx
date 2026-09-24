import React, { useState, useEffect } from 'react';
import { api } from '../api';

function EditarVenta({ venta, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    estudiante_id: venta.estudiante_id || '',
    producto_id: venta.producto_id || '',
    cantidad: venta.cantidad || '',
    fecha: venta.fecha ? venta.fecha.substring(0, 10) : ''
  });

  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    api.get('/estudiantes')
      .then(res => setEstudiantes(res.data))
      .catch(err => console.error(err));

    api.get('/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put(`/ventas/${venta.id}`, formData)
      .then(res => {
        alert(res.data.message || 'Venta actualizada');
        onUpdate();
      })
      .catch(err => console.error('Error al actualizar venta:', err));
  };

  return (
    <div className="modal-editar">
      <h3>Editar Venta #{venta.id}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Estudiante:</label>
          <select 
            name="estudiante_id" 
            value={formData.estudiante_id} 
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un estudiante</option>
            {estudiantes.map(e => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Producto:</label>
          <select 
            name="producto_id" 
            value={formData.producto_id} 
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un producto</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} (${p.precio})</option>
            ))}
          </select>
        </div>

        <div>
          <label>Cantidad:</label>
          <input 
            type="number" 
            name="cantidad" 
            value={formData.cantidad} 
            onChange={handleChange} 
            min="1"
            required 
          />
        </div>

        <div>
          <label>Fecha:</label>
          <input 
            type="date" 
            name="fecha" 
            value={formData.fecha} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit">Actualizar Venta</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
}

export default EditarVenta;