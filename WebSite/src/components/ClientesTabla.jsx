
// Importamos tres iconos de la librería lucide-react:
// Eye     icono para ver los detalles.
// Pencil  icono para editar.
// Trash2  cono para eliminar.

import { Eye, Pencil, Trash2 } from 'lucide-react';

// Este componente muestra los clientes dentro de una tabla.
// Recibe cuatro datos/funciones desde el componente padre:
// clientes:Lista de clientes que se mostrarán.
// seleccionados: Lista con los CustomerID de los clientes seleccionados.
// onToggleSeleccion: Función que selecciona o deselecciona un cliente.
//onVerUno: Función que permite ver los detalles de un cliente.

function ClientesTabla({
  clientes,
  seleccionados,
  onToggleSeleccion,
  onVerUno
}) {


  if (clientes.length === 0) {

    return (
      <p style={{ padding: '1rem' }}>
        No se encontraron clientes.
      </p>
    );
  }


  return (

    <table className="tabla-clientes">


      <thead>

        <tr>

          <th></th>

          {/* Identificador del cliente */}
          <th>Identificador</th>

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

                // Cuando el usuario marca o desmarca el checkbox,
                // enviamos el CustomerID al componente padre.
                onChange={() =>
                  onToggleSeleccion(c.CustomerID)
                }
              />

            </td>


            <td>
              {c.CustomerID}
            </td>


            <td>
              {c.Nombre_Cliente}
            </td>


            <td>
              {c.Categoria_Cliente}
            </td>


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

                  // Al hacer clic, enviamos el CustomerID
                  // para mostrar los detalles de ese cliente.

                  onClick={() =>
                    onVerUno(c.CustomerID)
                  }
                />


                {/* =============================================
                    EDITAR AUN INAVILITADO
                    ============================================= */}

                <Pencil
                  size={17}
                  className="editar"
                />


                {/* =============================================
                    ELIMINAR INAVILITADO
                    ============================================= */}

                <Trash2
                  size={17}
                  className="eliminar"
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
