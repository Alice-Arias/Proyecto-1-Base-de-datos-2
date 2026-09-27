
// Importamos los iconos que utilizaremos en la barra superior:
// Search       icono de búsqueda.
// Bell         icono de notificaciones.
// ChevronDown  flecha hacia abajo del usuario.

import {
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';



//Topbar AUN NO SIRVE
// Este componente crea la barra superior de la aplicación.
// Contiene:
// 1. Buscador general.
// 2. Icono de notificaciones.
// 3. Cantidad de notificaciones.
// 4. Usuario que está utilizando el sistema.
// 5. Flecha para indicar un menú desplegable.
// ============================================================

function Topbar() {

  return (

    <div className="topbar">


      <div className="search">


        {/* Icono de búsqueda */}
        <Search size={18} />


        {/* Campo donde el usuario puede escribir */}
        <input
          placeholder="Buscar en todo el sistema..."
        />


        {/* 
          Indicación del atajo de teclado.

          "Ctrl + K" normalmente se utiliza para
          abrir rápidamente el buscador.
        */}

        <span className="shortcut">
          Ctrl + K
        </span>

      </div>


      <div className="bell-wrap">


        {/* Icono de campana */}
        <Bell
          size={20}
          color="#6b7280"
        />


        {/* 
          Número de notificaciones.

          En este caso se muestran 3.
        */}

        <span className="bell-badge">
          3
        </span>

      </div>



      <div className="user">


        <div className="avatar">
          AD
        </div>

        Administrador

        <ChevronDown size={16} />

      </div>

    </div>
  );
}


export default Topbar;
