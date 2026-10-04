// Importamos los iconos que vamos a utilizar en el menú lateral
// desde la librería lucide-react.

import {
  Home,
  Users,
  Truck,
  Package,
  ShoppingCart,
  BarChart3,
  Database
} from 'lucide-react';


// Opciones que aparecerán en el Sidebar.
// Cada elemento tiene:
// - id    → identificador de la página (lo usa App.jsx).
// - label → texto que verá el usuario.
// - icon  → icono que aparecerá junto al texto.
//
// Ya NO hay "active: true" fijo. Ahora la opción activa
// la decide App.jsx mediante la prop "current".

const items = [
  //{ id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'proveedores', label: 'Proveedores', icon: Truck },
  { id: 'inventario', label: 'Inventario', icon: Package },
  { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 }
];


// Sidebar
// Este componente crea el menú lateral de la aplicación.
//
// Recibe dos props desde App.jsx:
//
// current:    id de la página que está abierta.
//             Sirve para marcar la opción activa.
//
// onNavigate: función que cambia de página.
//             Se ejecuta al hacer clic en una opción.

function Sidebar({ current, onNavigate }) {

  return (

    <aside className="sidebar">

      {/* LOGO */}

      <div className="logo">

        <Database color="#071cff" />

        <span>
          Sistema BD2
        </span>

      </div>


      {/* MENÚ DE NAVEGACIÓN */}

      <nav>

        {items.map((item) => (

          <div

            key={item.id}

            // Tendrá "active" solo si es la página actual.

            className={`nav-item ${current === item.id ? 'active' : ''}`}

            // Al hacer clic, le avisamos a App.jsx
            // qué página queremos abrir.

            onClick={() => onNavigate(item.id)}

            style={{ cursor: 'pointer' }}
          >

            <item.icon size={18} />

            {item.label}

          </div>

        ))}

      </nav>

    </aside>
  );
}


export default Sidebar;