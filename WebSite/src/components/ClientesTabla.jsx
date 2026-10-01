// ============================================================
// ICONOS
// ============================================================

// Importamos tres iconos de la librería lucide-react:
//
// Eye     → icono para ver los detalles.
// Pencil  → icono para editar.
// Trash2  → icono para eliminar.

import { Eye, Pencil, Trash2 } from 'lucide-react';


// ============================================================
// TABLA DE CLIENTES
// ============================================================

// Este componente muestra los clientes dentro de una tabla.
//
// Recibe seis datos/funciones desde el componente padre:
//
// clientes:
// Lista de clientes que se mostrarán.
//
// seleccionados:
// Lista con los CustomerID de los clientes seleccionados.
//
// onToggleSeleccion:
// Función que selecciona o deselecciona un cliente.
//
// onVerUno:
// Función que permite ver los detalles de un cliente.
//
// onEditar:
// Función que permite editar un cliente.
//
// onEliminar:
// Función que permite eliminar un cliente.

function ClientesTabla({
  clientes,
  seleccionados,
  onToggleSeleccion,
  onVerUno,
  onEditar,
  onEliminar
}) {

  // ============================================================
  // SIN CLIENTES
  // ============================================================

  // Si no existen clientes, mostramos este mensaje.

  if (clientes.length === 0) {
    return (
      <p style={{ padding: '1rem' }}>
        No se encontraron clientes.
      </p>
    );
  }

  // ============================================================
  // TABLA
  // ============================================================

  return (
    <table className="tabla-clientes">

      {/* =====================================================
          ENCABEZADO DE LA TABLA
          ===================================================== */}

      <thead>
        <tr>

          {/* Checkbox */}
          <th></th>

          {/* Nombre del cliente */}
          <th>Nombre Cliente</th>

          {/* Categoría del cliente */}
          <th>Categoría</th>

          {/* Método de entrega */}
          <th>Método de entrega</th>

          {/* Botones de acciones */}
          <th>Acciones</th>

        </tr>
      </thead>

      {/* =====================================================
          CUERPO DE LA TABLA
          ===================================================== */}

      <tbody>

        {clientes.map((c) => (

          <tr key={c.CustomerID}>

            {/* =================================================
                CHECKBOX
                ================================================= */}

            <td>
              <input
                type="checkbox"

                // Determina si el checkbox aparece marcado.
                //
                // includes() pregunta:
                // "¿El CustomerID de este cliente está dentro
                // de la lista de seleccionados?"

                checked={seleccionados.includes(c.CustomerID)}

                // Cuando el usuario marca o desmarca
                // el checkbox, enviamos el CustomerID
                // al componente padre.

                onChange={() =>
                  onToggleSeleccion(c.CustomerID)
                }
              />
            </td>

            {/* =================================================
                NOMBRE
                ================================================= */}

            <td>
              {c.Nombre_Cliente}
            </td>

            {/* =================================================
                CATEGORÍA
                ================================================= */}

            <td>
              {c.Categoria_Cliente}
            </td>

            {/* =================================================
                MÉTODO DE ENTREGA
                ================================================= */}

            <td>
              {c.Metodo_Entrega || '-'}
            </td>

            {/* =================================================
                ACCIONES DE CRUD
                ================================================= */}

            <td>

              <div className="acciones-cel">

                {/* =============================================
                    VER
                    ============================================= */}

                <Eye
                  size={17}
                  className="ver"
                  title="Ver detalles"

                  // El CustomerID sigue utilizándose
                  // internamente para buscar el cliente.

                  onClick={() =>
                    onVerUno(c.CustomerID)
                  }
                />

                {/* =============================================
                    EDITAR
                    ============================================= */}

                <Pencil
                  size={17}
                  className="editar"
                  title="Modificar cliente"

                  // Enviamos el cliente completo
                  // al componente padre.

                  onClick={() =>
                    onEditar(c)
                  }
                />

                {/* =============================================
                    ELIMINAR
                    ============================================= */}

                <Trash2
                  size={17}
                  className="eliminar"
                  title="Eliminar cliente"

                  // Enviamos el cliente completo
                  // al componente padre.

                  onClick={() =>
                    onEliminar(c)
                  }
                />

              </div>

            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}

export default ClientesTabla;