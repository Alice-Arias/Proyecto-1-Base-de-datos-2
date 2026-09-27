import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ClientesPage from './pages/ClientesPage';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div className="content">
          <ClientesPage />
        </div>
      </div>
    </div>
  );
}

export default App;