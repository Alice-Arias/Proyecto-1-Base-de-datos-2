import { useState } from 'react';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ClientesPage from './pages/ClientesPage';
import ProveedoresPage from './pages/ProveedoresPage';
import './App.css';

function App() {

  // Página que se muestra al abrir la aplicación.
  const [page, setPage] = useState('clientes');

  return (
    <div className="app-shell">

      {/* El Sidebar sabe cuál es la página actual
          y avisa cuando el usuario elige otra. */}
      <Sidebar
        current={page}
        onNavigate={setPage}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        <Topbar />

        <div className="content">

          {page === 'clientes' && <ClientesPage />}

          {page === 'proveedores' && <ProveedoresPage />}

        </div>

      </div>

    </div>
  );
}

export default App;