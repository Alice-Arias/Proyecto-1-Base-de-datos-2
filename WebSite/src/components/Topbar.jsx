

import {
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';


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
