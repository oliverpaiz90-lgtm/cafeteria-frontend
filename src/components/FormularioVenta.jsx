import React, { useState, useEffect } from 'react';
import { api } from '../api';

function FormularioVenta() {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    producto_id: '',
    cantidad: '',
    fecha: ''
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
    api.post('/ventas', formData)
      .then(res => {
        alert(res.data.message || 'Venta registrada');
        setFormData({ estudiante_id: '', producto_id: '', cantidad: '', fecha: '' });
      })
      .catch(err => console.error('Error al registrar venta:', err));
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-venta">
      <h2>Registrar Nueva Venta</h2>
      
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

      <button type="submit">Guardar Venta</button>
    </form>
  );
}

export default FormularioVenta;