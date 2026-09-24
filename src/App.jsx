import React, { useState, useEffect } from 'react';
import FormularioVenta from './components/FormularioVenta';
import ListaVentas from './components/ListaVentas';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://vigilant-fortnight-3.onrender.com';

function App() {
  const [ventas, setVentas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [ventaAEditar, setVentaAEditar] = useState(null);
  const [apiPrefix, setApiPrefix] = useState('/api'); // Detecta si las rutas llevan /api o no

  useEffect(() => {
    cargarDatos();
  }, []);

  // Función helper para intentar hacer fetch con o sin /api
  const fetchConFallback = async (endpoint) => {
    try {
      // 1. Intentar con /api
      let res = await fetch(`${API_URL}/api${endpoint}`);
      if (res.ok) {
        setApiPrefix('/api');
        return await res.json();
      }

      // 2. Si da 404, intentar sin /api
      res = await fetch(`${API_URL}${endpoint}`);
      if (res.ok) {
        setApiPrefix('');
        return await res.json();
      }
    } catch (error) {
      console.error(`Error en fetch para ${endpoint}:`, error);
    }
    return [];
  };

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [dataVentas, dataEstudiantes, dataProductos] = await Promise.all([
        fetchConFallback('/ventas'),
        fetchConFallback('/estudiantes'),
        fetchConFallback('/productos')
      ]);

      setVentas(Array.isArray(dataVentas) ? dataVentas : []);
      setEstudiantes(Array.isArray(dataEstudiantes) ? dataEstudiantes : []);
      setProductos(Array.isArray(dataProductos) ? dataProductos : []);
    } catch (error) {
      console.error('Error al cargar datos desde la API:', error);
      setVentas([]);
      setEstudiantes([]);
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardarVenta = async (ventaData) => {
    try {
      const endpoint = ventaAEditar
        ? `${API_URL}${apiPrefix}/ventas/${ventaAEditar.id}`
        : `${API_URL}${apiPrefix}/ventas`;
      const method = ventaAEditar ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
      });

      if (res.ok) {
        setVentaAEditar(null);
        cargarDatos();
      } else {
        alert('Error al guardar la venta');
      }
    } catch (error) {
      console.error('Error al guardar la venta:', error);
    }
  };

  const handleEditar = (venta) => {
    setVentaAEditar(venta);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta venta?')) return;
    try {
      const res = await fetch(`${API_URL}${apiPrefix}/ventas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        cargarDatos();
      } else {
        alert('Error al eliminar la venta');
      }
    } catch (error) {
      console.error('Error al eliminar venta:', error);
    }
  };

  const formatMoneda = (monto) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(monto || 0);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Sistema de Gestión de Ventas</h1>
      </header>

      <main className="main-content">
        <FormularioVenta
          estudiantes={estudiantes}
          productos={productos}
          onGuardar={handleGuardarVenta}
          ventaAEditar={ventaAEditar}
          setVentaAEditar={setVentaAEditar}
        />

        <ListaVentas
          ventas={ventas}
          cargando={cargando}
          handleEditar={handleEditar}
          handleEliminar={handleEliminar}
          formatMoneda={formatMoneda}
        />
      </main>
    </div>
  );
}

export default App;