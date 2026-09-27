
// URL BASE DE LA API
// Dirección donde está funcionando el servidor backend.
const API_URL = 'http://localhost:4000/api';


// OBTENER LISTA DE CLIENTES
export async function listarClientes(filtros = {}) {

  // Objeto que se utilizará para construir los parámetros
  // que se enviarán en la URL.
  const params = new URLSearchParams();

  // FILTRO POR NOMBRE
  // Si se recibió un nombre, se agrega a los parámetros.
  if (filtros.nombre) {
    params.append('nombre', filtros.nombre);
  }

  // FILTRO POR CATEGORÍA
  // Si se recibió una categoría, se agrega a los parámetros.
  if (filtros.categoria) {
    params.append('categoria', filtros.categoria);
  }

  // FILTRO POR MÉTODO DE ENTREG
  // Si se recibió un método de entrega, se agrega a los parámetros.
  if (filtros.metodoEntrega) {
    params.append('metodoEntrega', filtros.metodoEntrega);
  }


  // REALIZAR PETICIÓN AL BACKEND
  // Se construye la URL incluyendo los filtros.
  const res = await fetch(
    `${API_URL}/clientes?${params.toString()}`
  );


  if (!res.ok) {
    throw new Error('Error al obtener clientes');
  }


  return res.json();
}


// OBTENER DETALLE DE CLIENTES

export async function obtenerDetalleClientes(ids) {

  // Si se recibe un arreglo de IDs,
  // se unen utilizando comas.
  //
  // Ejemplo:
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


  // -------
  if (!res.ok) {
    throw new Error('Error al obtener el detalle');
  }


  return res.json();
}
