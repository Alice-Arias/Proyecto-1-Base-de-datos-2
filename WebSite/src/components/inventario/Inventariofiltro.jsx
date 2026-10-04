import { useState } from 'react';


// ============================================================
// FILTRO DE INVENTARIO
// ============================================================
//
// Este componente permite:
//
// 1. Buscar productos por nombre.
// 2. Seleccionar un grupo.
// 3. Combinar ambos filtros al mismo tiempo.
// 4. Restaurar todos los filtros.
//
// Recibe tres datos/funciones desde el componente padre:
//
// grupos:
// Lista de grupos disponibles para el selector.
//
// onBuscar:
// Se ejecuta cuando presionamos "Buscar" (o Enter).
// Recibe un objeto: { nombre, grupo }
//
// onRestaurar:
// Se ejecuta cuando presionamos "Restaurar filtros".

function InventariosFiltro({
  grupos,
  onBuscar,
  onRestaurar
}) {

  // ============================================================
  // VARIABLES DE ESTADO
  // ============================================================

  const [nombre, setNombre] = useState('');

  const [grupo, setGrupo] = useState('');


  // ============================================================
  // BUSCAR
  // ============================================================

  const buscar = () => {

    onBuscar({
      nombre,
      grupo
    });

  };


  // ============================================================
  // RESTAURAR FILTROS
  // ============================================================

  const restaurar = () => {

    setNombre('');

    setGrupo('');

    onRestaurar();

  };


  // ============================================================
  // INTERFAZ
  // ============================================================

  return (

    <div className="filtro">

      {/* BUSCAR POR NOMBRE (Enter también busca) */}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={nombre}
        onChange={(e) =>
          setNombre(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter') buscar();
        }}
      />


      {/* SELECCIONAR GRUPO */}
      <select
        value={grupo}
        onChange={(e) =>
          setGrupo(e.target.value)
        }
      >

        <option value="">
          Todos los grupos
        </option>

        {grupos.map((grupoNombre) => (

          <option
            key={grupoNombre}
            value={grupoNombre}
          >
            {grupoNombre}
          </option>

        ))}

      </select>


      {/* BOTÓN BUSCAR */}
      <button
        type="button"
        className="btn-buscar"
        onClick={buscar}
      >
        Buscar
      </button>


      {/* BOTÓN RESTAURAR */}
      <button
        type="button"
        className="btn-restaurar"
        onClick={restaurar}
      >
        Restaurar filtros
      </button>

    </div>

  );

}

export default InventariosFiltro;