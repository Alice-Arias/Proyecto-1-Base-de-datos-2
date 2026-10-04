
import { useState } from 'react';


// Este componente permite:
// 1. Escribir el nombre de un cliente.
// 2. Escribir una categoría.
// 3. Escribir un método de entrega.
// 4. Buscar clientes con esos filtros.
// 5. Restaurar todos los filtros.
// Recibe dos funciones desde el componente padre:
// onBuscar: se ejecuta cuando presionamos "Buscar".
// onRestaurar: se ejecuta cuando presionamos "Restaurar filtros".

function ClientesFiltro({ onBuscar, onRestaurar }) {


  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState('');



  // buscar
  // Toma los tres filtros y los envía al componente padre
  // mediante la función onBuscar.

  const buscar = () => {
    onBuscar({
      nombre,
      categoria,
      metodoEntrega
    });
  };

  // restaurar
  // 1. Limpia los tres campos del formulario.
  // 2. Le avisa al componente padre que debe restaurar los resultados originales.
  const restaurar = () => {
    setNombre('');
    setCategoria('');
    setMetodoEntrega('');

    onRestaurar();
  };



  return (
    <div className="filtro">

      {/* Campo para buscar por nombre */}
      <input
        placeholder="Buscar por nombre..."
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />


      {/* Campo para buscar por categoría */}
      <input
        placeholder="Categoría..."
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />


      {/* Campo para buscar por método de entrega */}
      <input
        placeholder="Método de entrega..."
        value={metodoEntrega}
        onChange={(e) => setMetodoEntrega(e.target.value)}
      />


      {/* Botón que ejecuta la búsqueda */}
      <button
        className="btn-buscar"
        onClick={buscar}
      >
        Buscar
      </button>


      {/* Botón que limpia los filtros */}
      <button
        className="btn-restaurar"
        onClick={restaurar}
      >
        Restaurar filtros
      </button>

    </div>
  );
}

export default ClientesFiltro;

