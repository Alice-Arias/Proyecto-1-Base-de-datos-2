
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


// Aquí definimos todas las opciones que aparecerán
// en el Sidebar.
// Cada elemento tiene:
// - label → texto que verá el usuario.
// - icon  → icono que aparecerá junto al texto.
// - active → indica cuál opción está seleccionada.
// En este caso, "Clientes" está activa.

const items = [

  {
    label: 'Inicio',
    icon: Home
  },

  {
    label: 'Clientes',
    icon: Users,
    active: true
  },

  {
    label: 'Proveedores',
    icon: Truck
  },

  {
    label: 'Productos',
    icon: Package
  },

  {
    label: 'Ventas',
    icon: ShoppingCart
  },

  {
    label: 'Reportes',
    icon: BarChart3
  }

];



// Sidebar
// Este componente crea el menú lateral de la aplicación.
// Contiene:
// Logo y nombre del proyecto.
// Opciones de navegación.


function Sidebar() {

  return (

    <aside className="sidebar">


      {/* ======================================================
          LOGO
          ====================================================== */}

      <div className="logo">

        {/* Icono de base de datos */}
        <Database color="#071cff" />

        {/* Nombre del proyecto */}
        <span>
          Sistema BD2
        </span>

      </div>


      {/* ======================================================
          MENÚ DE NAVEGACIÓN
          ====================================================== */}

      <nav>

        {items.map((item) => (


          <div

            key={item.label}


            // =================================================
            // CLASE CSS
            // =================================================
            // Siempre tendrá:
            //
            // nav-item
            //
            // Y si "active" es true, también tendrá:
            //
            // active
            //
            // Por ejemplo, Clientes tendrá:
            //
            // className="nav-item active"
            //
            // Mientras Inicio tendrá:
            //
            // className="nav-item"
            // =================================================

            className={`nav-item ${item.active ? 'active' : ''}`}
          >


            {/* =================================================
                ICONO
                =================================================
                Cada elemento tiene un icono diferente.

                Por ejemplo:

                Inicio      → Home
                Clientes    → Users
                Proveedores → Truck
                Productos   → Package

                "item.icon" obtiene el icono correspondiente
                al elemento actual.
            ================================================= */}

            <item.icon size={18} />

            {item.label}


          </div>

        ))}

      </nav>

    </aside>
  );
}


export default Sidebar;
