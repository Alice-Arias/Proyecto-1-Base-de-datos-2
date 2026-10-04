import { useState } from 'react';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import ClientesPage from './pages/ClientesPage';
import ProveedoresPage from './pages/ProveedoresPage';
import InventarioPage from './pages/InventarioPage';

import './App.css';

function App() {
    // Página que se muestra al abrir la aplicación.
    const [page, setPage] = useState('clientes');

    return (
        <div className="app-shell">

            <Sidebar
                current={page}
                onNavigate={setPage}
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Topbar />

                <div className="content">
                    {page === 'clientes' && <ClientesPage />}
                    {page === 'proveedores' && <ProveedoresPage />}
                    {page === 'inventario' && <InventarioPage />}
                </div>
            </div>

        </div>
    );
}

export default App;