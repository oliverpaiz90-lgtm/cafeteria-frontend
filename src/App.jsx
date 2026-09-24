import React, { useState, useEffect } from 'react';
import FormularioVenta from './components/FormularioVenta';
import ListaVentas from './components/ListaVentas';
import './App.css';

// URL base para la API
const API_URL = import.meta.env.VITE_API_URL || 'https://vigilant-fortnight-3.onrender.com';

function App() {
  const [ventas, setVentas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [ventaAEditar, setVentaAEditar] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [resVentas, resEstudiantes, resProductos] = await Promise.all([
        fetch(`${API_URL}/api/ventas`).catch(() => null),
        fetch(`${API_URL}/api/estudiantes`).catch(() => null),
        fetch(`${API_URL}/api/productos`).catch(() => null)
      ]);

      if (resVentas && resVentas.ok) {
        const dataVentas = await resVentas.json();
        setVentas(Array.isArray(dataVentas) ? dataVentas : []);
      } else {
        setVentas([]);
      }

      if (resEstudiantes && resEstudiantes.ok) {
        const dataEst = await resEstudiantes.json();
        setEstudiantes(Array.isArray(dataEst) ? dataEst : []);
      } else {
        setEstudiantes([]);
      }

      if (resProductos && resProductos.ok) {
        const dataProd = await resProductos.json();
        setProductos(Array.isArray(dataProd) ? dataProd : []);
      } else {
        setProductos([]);
      }
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
      const url = ventaAEditar
        ? `${API_URL}/api/ventas/${ventaAEditar.id}`
        : `${API_URL}/api/ventas`;
      const method = ventaAEditar ? 'PUT' : 'POST';

      const res = await fetch(url, {
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
      const res = await fetch(`${API_URL}/api/ventas/${id}`, { method: 'DELETE' });
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