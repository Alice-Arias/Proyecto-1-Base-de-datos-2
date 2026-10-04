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

  const params = new URLSearchParams();

  if (filtros.nombre) {
    params.append('nombre', filtros.nombre);
  }

  if (filtros.categoria) {
    params.append('categoria', filtros.categoria);
  }

  if (filtros.metodoEntrega) {
    params.append('metodoEntrega', filtros.metodoEntrega);
  }

  const res = await fetch(
    `${API_URL}/clientes?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error('Error al obtener clientes');
  }

  return res.json();

}


// ============================================================
// OBTENER DETALLE DE CLIENTES
// ============================================================

export async function obtenerDetalleClientes(ids) {

  const idsStr = Array.isArray(ids)
    ? ids.join(',')
    : String(ids);

  const res = await fetch(
    `${API_URL}/clientes/${idsStr}`
  );

  if (!res.ok) {
    throw new Error('Error al obtener el detalle');
  }

  return res.json();

}


// ============================================================
// INSERTAR CLIENTE
// ============================================================

export async function insertarCliente(cliente) {

  const res = await fetch(
    `${API_URL}/clientes`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'No se pudo crear el cliente');
  }

  return data;

}


// ============================================================
// ACTUALIZAR CLIENTE
// ============================================================

export async function actualizarCliente(id, cliente) {

  const res = await fetch(
    `${API_URL}/clientes/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'No se pudo actualizar el cliente');
  }

  return data;

}


// ============================================================
// ELIMINAR CLIENTE
// ============================================================

export async function eliminarCliente(id) {

  const res = await fetch(
    `${API_URL}/clientes/${id}`,
    { method: 'DELETE' }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'No se pudo eliminar el cliente');
  }

  return data;

}


// ============================================================
// OBTENER OPCIONES PARA EL FORMULARIO DE CLIENTES
// ============================================================

export async function obtenerOpcionesClientes() {

  const res = await fetch(`${API_URL}/clientes/opciones`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || 'No se pudieron obtener las opciones de clientes.'
    );
  }

  return data;
}


// ============================================================
// PROVEEDORES
// ============================================================


export async function listarProveedores(filtros = {}) {

  const params = new URLSearchParams();

  if (filtros.nombre) {
    params.append('nombre', filtros.nombre);
  }

  if (filtros.categoria) {
    params.append('categoria', filtros.categoria);
  }

  if (filtros.metodoEntrega) {
    params.append('metodoEntrega', filtros.metodoEntrega);
  }

  const res = await fetch(
    `${API_URL}/proveedores?${params.toString()}`
  );

  if (!res.ok) {
    throw new Error('Error al obtener proveedores');
  }

  return res.json();

}


export async function obtenerDetalleProveedores(ids) {

  const idsStr = Array.isArray(ids)
    ? ids.join(',')
    : String(ids);

  const res = await fetch(
    `${API_URL}/proveedores/${idsStr}`
  );

  if (!res.ok) {
    throw new Error('Error al obtener el detalle');
  }

  return res.json();

}


export async function insertarProveedor(proveedor) {

  const res = await fetch(
    `${API_URL}/proveedores`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proveedor)
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'No se pudo crear el proveedor');
  }

  return data;

}


export async function actualizarProveedor(id, proveedor) {

  const res = await fetch(
    `${API_URL}/proveedores/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proveedor)
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'No se pudo actualizar el proveedor');
  }

  return data;

}


export async function eliminarProveedor(id) {

  const res = await fetch(
    `${API_URL}/proveedores/${id}`,
    { method: 'DELETE' }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'No se pudo eliminar el proveedor');
  }

  return data;

}


export async function obtenerOpcionesProveedores() {

  const res = await fetch(`${API_URL}/proveedores/opciones`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || 'No se pudieron obtener las opciones de proveedores.'
    );
  }

  return data;

}


// ============================================================
// INVENTARIO
// ============================================================


export async function listarInventarios(filtros = {}) {

  const params = new URLSearchParams();

  if (filtros.nombre) {
    params.append('nombre', filtros.nombre);
  }

  if (filtros.grupo) {
    params.append('grupo', filtros.grupo);
  }

  if (filtros.cantidad !== undefined && filtros.cantidad !== '') {
    params.append('cantidad', filtros.cantidad);
  }

  const query = params.toString();

  const res = await fetch(
    `${API_URL}/inventarios${query ? `?${query}` : ''}`
  );

  if (!res.ok) {
    throw new Error('Error al obtener inventarios');
  }

  return res.json();

}


export async function obtenerDetalleInventarios(ids) {

  const idsStr = Array.isArray(ids)
    ? ids.join(',')
    : String(ids);

  const res = await fetch(
    `${API_URL}/inventarios/${idsStr}`
  );

  if (!res.ok) {
    throw new Error('Error al obtener el detalle del inventario');
  }

  return res.json();

}


export async function insertarInventario(inventario) {

  const res = await fetch(
    `${API_URL}/inventarios`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inventario)
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'No se pudo crear el producto');
  }

  return data;

}


export async function actualizarInventario(id, inventario) {

  const res = await fetch(
    `${API_URL}/inventarios/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inventario)
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'No se pudo actualizar el producto');
  }

  return data;

}


export async function eliminarInventario(id) {

  const res = await fetch(
    `${API_URL}/inventarios/${id}`,
    { method: 'DELETE' }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'No se pudo eliminar el producto');
  }

  return data;

}


export async function obtenerOpcionesInventario() {

  const res = await fetch(`${API_URL}/inventarios/opciones`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || 'No se pudieron obtener las opciones del inventario.'
    );
  }

  return data;

}


// ============================================================
// VENTAS
// ============================================================


// ============================================================
// OBTENER LISTA DE VENTAS
// ============================================================
//
// Filtros acumulativos:
// - numeroFactura
// - fechaInicio / fechaFin (rango de fechas)
// - cliente (texto libre, coincidencia parcial)
// - metodoEntrega
// - montoInicio / montoFin (rango de monto)
//
// GET /api/ventas
//
// El backend ejecutará: SP_Ventas_Listar
// ============================================================

export async function listarVentas(filtros = {}) {

  const params = new URLSearchParams();

  if (filtros.numeroFactura !== undefined && filtros.numeroFactura !== '') {
    params.append('numeroFactura', filtros.numeroFactura);
  }

  if (filtros.fechaInicio) {
    params.append('fechaInicio', filtros.fechaInicio);
  }

  if (filtros.fechaFin) {
    params.append('fechaFin', filtros.fechaFin);
  }

  if (filtros.cliente) {
    params.append('cliente', filtros.cliente);
  }

  if (filtros.metodoEntrega) {
    params.append('metodoEntrega', filtros.metodoEntrega);
  }

  if (filtros.montoInicio !== undefined && filtros.montoInicio !== '') {
    params.append('montoInicio', filtros.montoInicio);
  }

  if (filtros.montoFin !== undefined && filtros.montoFin !== '') {
    params.append('montoFin', filtros.montoFin);
  }

  const query = params.toString();

  const res = await fetch(
    `${API_URL}/ventas${query ? `?${query}` : ''}`
  );

  if (!res.ok) {
    throw new Error('Error al obtener las ventas');
  }

  return res.json();

}


// ============================================================
// OBTENER DETALLE DE UNA VENTA
// ============================================================
//
// A diferencia de clientes/proveedores/inventario, acá se
// consulta UNA sola venta a la vez (el SP solo acepta un
// InvoiceID). Devuelve { encabezado, lineas }.
//
// GET /api/ventas/:id
//
// El backend ejecutará: SP_Ventas_Detalle
// ============================================================

export async function obtenerDetalleVenta(id) {

  const res = await fetch(
    `${API_URL}/ventas/${id}`
  );

  if (!res.ok) {
    throw new Error('Error al obtener el detalle de la venta');
  }

  return res.json();

}


// ============================================================
// INSERTAR VENTA
// ============================================================
//
// POST /api/ventas
//
// El backend ejecutará: SP_Ventas_Insertar
// ============================================================

export async function insertarVenta(venta) {

  const res = await fetch(
    `${API_URL}/ventas`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venta)
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'No se pudo crear la venta');
  }

  return data;

}


// ============================================================
// ACTUALIZAR VENTA
// ============================================================
//
// PUT /api/ventas/:id
//
// El backend ejecutará: SP_Ventas_Actualizar
// ============================================================

export async function actualizarVenta(id, venta) {

  const res = await fetch(
    `${API_URL}/ventas/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venta)
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'No se pudo actualizar la venta');
  }

  return data;

}


// ============================================================
// OBTENER OPCIONES PARA EL FORMULARIO DE VENTAS
// ============================================================
//
// Devuelve: clientes, metodosEntrega, contactos, vendedores,
// pedidos, productos, tiposPaquete.
//
// GET /api/ventas/opciones
//
// El backend ejecutará: SP_Ventas_Opciones
// ============================================================

export async function obtenerOpcionesVentas() {

  const res = await fetch(`${API_URL}/ventas/opciones`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || 'No se pudieron obtener las opciones de ventas.'
    );
  }

  return data;

}