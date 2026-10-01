
// ============================================================
// URL BASE DE LA API
// ============================================================
//
// Dirección donde está funcionando el servidor backend.

const API_URL = 'http://localhost:4000/api';


// ============================================================
// OBTENER LISTA DE CLIENTES
// ============================================================

export async function listarClientes(filtros = {}) {

  // Objeto que se utilizará para construir
  // los parámetros que se enviarán en la URL.

  const params = new URLSearchParams();


  // ==========================================================
  // FILTRO POR NOMBRE
  // ==========================================================

  // Si se recibió un nombre,
  // se agrega a los parámetros.

  if (filtros.nombre) {

    params.append(
      'nombre',
      filtros.nombre
    );

  }


  // ==========================================================
  // FILTRO POR CATEGORÍA
  // ==========================================================

  // Si se recibió una categoría,
  // se agrega a los parámetros.

  if (filtros.categoria) {

    params.append(
      'categoria',
      filtros.categoria
    );

  }


  // ==========================================================
  // FILTRO POR MÉTODO DE ENTREGA
  // ==========================================================

  // Si se recibió un método de entrega,
  // se agrega a los parámetros.

  if (filtros.metodoEntrega) {

    params.append(
      'metodoEntrega',
      filtros.metodoEntrega
    );

  }


  // ==========================================================
  // REALIZAR PETICIÓN AL BACKEND
  // ==========================================================

  // Se construye la URL incluyendo los filtros.

  const res = await fetch(
    `${API_URL}/clientes?${params.toString()}`
  );


  if (!res.ok) {

    throw new Error(
      'Error al obtener clientes'
    );

  }


  return res.json();

}


// ============================================================
// OBTENER DETALLE DE CLIENTES
// ============================================================

export async function obtenerDetalleClientes(ids) {

  // Si se recibe un arreglo de IDs,
  // se unen utilizando comas.
  //
  // Ejemplo:
  //
  // [1, 2, 3] → "1,2,3"
  //
  // Si solamente se recibe un ID,
  // se convierte directamente a texto.

  const idsStr = Array.isArray(ids)

    ? ids.join(',')

    : String(ids);


  const res = await fetch(
    `${API_URL}/clientes/${idsStr}`
  );


  if (!res.ok) {

    throw new Error(
      'Error al obtener el detalle'
    );

  }


  return res.json();

}


// ============================================================
// INSERTAR CLIENTE
// ============================================================
//
// Envía los datos del nuevo cliente al backend.
//
// POST /api/clientes
//
// El backend ejecutará:
// SP_Clientes_Insertar
// ============================================================

export async function insertarCliente(cliente) {

  const res = await fetch(
    `${API_URL}/clientes`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(cliente)
    }
  );


  // Convertimos la respuesta del backend a JSON.

  const data = await res.json();


  // Si el backend devuelve un error,
  // conservamos el mensaje que viene del servidor.

  if (!res.ok) {

    throw new Error(
      data.error ||
      'No se pudo crear el cliente'
    );

  }


  return data;

}


// ============================================================
// ACTUALIZAR CLIENTE
// ============================================================
//
// Modifica un cliente existente.
//
// PUT /api/clientes/:id
//
// El backend ejecutará:
// SP_Clientes_Actualizar
// ============================================================

export async function actualizarCliente(
  id,
  cliente
) {

  const res = await fetch(
    `${API_URL}/clientes/${id}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(cliente)
    }
  );


  // Convertimos la respuesta del backend a JSON.

  const data = await res.json();


  // Si el backend devuelve un error,
  // mostramos el mensaje enviado por el servidor.

  if (!res.ok) {

    throw new Error(
      data.error ||
      'No se pudo actualizar el cliente'
    );

  }


  return data;

}


// ============================================================
// ELIMINAR CLIENTE
// ============================================================
//
// Elimina un cliente existente.
//
// DELETE /api/clientes/:id
//
// El backend ejecutará:
// SP_Clientes_Eliminar
// ============================================================

export async function eliminarCliente(id) {

  const res = await fetch(
    `${API_URL}/clientes/${id}`,
    {
      method: 'DELETE'
    }
  );


  // Convertimos la respuesta del backend a JSON.

  const data = await res.json();


  // Si el backend devuelve un error,
  // conservamos el mensaje que viene del servidor.

  if (!res.ok) {

    throw new Error(
      data.error ||
      'No se pudo eliminar el cliente'
    );

  }


  return data;

}

// ============================================================
// OBTENER OPCIONES PARA EL FORMULARIO DE CLIENTES
// ============================================================

export async function obtenerOpcionesClientes() {

    const res = await fetch(
        `${API_URL}/clientes/opciones`
    );

    const data = await res.json();

    if (!res.ok) {

        throw new Error(
            data.error ||
            'No se pudieron obtener las opciones de clientes.'
        );

    }

    return data;
}
