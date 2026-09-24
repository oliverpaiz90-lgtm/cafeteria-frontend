import React from 'react';
import ListaVentas from './components/ListaVentas';
import FormularioVenta from './components/FormularioVenta';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Cafetería Escolar</h1>
        <p>Registro y control de ventas del día</p>
      </header>

      <FormularioVenta />
      <ListaVentas />
    </div>
  );
}

export default App;