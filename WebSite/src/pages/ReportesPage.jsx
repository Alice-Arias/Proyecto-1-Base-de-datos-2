// ============================================================
// IMPORTACIONES DE REACT
// ============================================================

import { useEffect, useState } from 'react';

// ============================================================
// ICONOS
// ============================================================

import { BarChart3, Database, Rows3, Sun } from 'lucide-react';

// ============================================================
// COMPONENTES
// ============================================================

import ReportesFiltro from '../components/reportes/ReportesFiltro';
import ReportesTabla from '../components/reportes/ReportesTabla';
import StatCard from '../components/StatCard';
import '../components/reportes/reportes.css';

// ============================================================
// FUNCIONES QUE SE COMUNICAN CON LA API
// ============================================================

import { ejecutarReporte, obtenerOpcionesReportes } from '../services/api';


// ============================================================
// CANTIDAD MÁXIMA DE FILAS POR PÁGINA
// ============================================================

const POR_PAGINA = 10;


// ============================================================
// REPORTES
//
// Catálogo de reportes disponibles. Cada reporte define:
//
// - id: identificador que se envía a la API.
// - titulo: nombre que se muestra al usuario.
// - grupo: área a la que pertenece (Compras, Ventas, Inventario).
// - filtros: filtros que acepta el reporte, donde "tipo" indica
//   de dónde salen sus opciones (ver OPCIONES_VACIAS) o si es
//   un campo de texto libre ('text').
// ============================================================

const REPORTES = [
  { id: 'comprasProveedores', titulo: 'Compras por proveedor', grupo: 'Compras', filtros: [
    { id: 'categoriaProveedor', label: 'Categoría de proveedor', tipo: 'categoriasProveedores' },
    { id: 'proveedor', label: 'Proveedor', tipo: 'text' }
  ] },
  { id: 'ventasClientes', titulo: 'Ventas por cliente', grupo: 'Ventas', filtros: [
    { id: 'categoriaCliente', label: 'Categoría de cliente', tipo: 'categoriasClientes' },
    { id: 'cliente', label: 'Cliente', tipo: 'text' }
  ] },
  { id: 'topProductos', titulo: 'Productos con más ganancia', grupo: 'Ventas', filtros: [
    { id: 'anio', label: 'Año', tipo: 'aniosVentas' }
  ] },
  { id: 'topClientes', titulo: 'Clientes con más facturas', grupo: 'Ventas', filtros: [
    { id: 'anio', label: 'Año', tipo: 'aniosVentas' }
  ] },
  { id: 'topProveedores', titulo: 'Proveedores con más órdenes', grupo: 'Compras', filtros: [
    { id: 'anio', label: 'Año', tipo: 'aniosCompras' }
  ] },
  { id: 'ventasCategorias', titulo: 'Ventas por categoría y año', grupo: 'Ventas', filtros: [] },
  { id: 'seguimientoClientes', titulo: 'Seguimiento de compras de clientes', grupo: 'Ventas', filtros: [
    { id: 'anio', label: 'Año', tipo: 'aniosVentas' },
    { id: 'mes', label: 'Mes', tipo: 'meses' },
    { id: 'categoriaProducto', label: 'Categoría de producto', tipo: 'categoriasProductos' }
  ] },
  { id: 'seguimientoProveedores', titulo: 'Seguimiento de compras a proveedores', grupo: 'Compras', filtros: [
    { id: 'anio', label: 'Año', tipo: 'aniosCompras' },
    { id: 'mes', label: 'Mes', tipo: 'meses' },
    { id: 'categoriaProducto', label: 'Categoría de producto', tipo: 'categoriasProductos' }
  ] },
  { id: 'rotacionInventario', titulo: 'Rotación de inventario', grupo: 'Inventario', filtros: [
    { id: 'categoriaProducto', label: 'Categoría de producto', tipo: 'categoriasProductos' },
    { id: 'anio', label: 'Año', tipo: 'aniosCompras' },
    { id: 'proveedor', label: 'Proveedor', tipo: 'proveedores' }
  ] },
  { id: 'metodoEnvioFavorito', titulo: 'Método de envío favorito', grupo: 'Ventas', filtros: [
    { id: 'anio', label: 'Año', tipo: 'aniosVentas' },
    { id: 'mes', label: 'Mes', tipo: 'meses' },
    { id: 'categoriaCliente', label: 'Categoría de cliente', tipo: 'categoriasClientes' },
    { id: 'categoriaProducto', label: 'Categoría de producto', tipo: 'categoriasProductos' },
    { id: 'producto', label: 'Producto', tipo: 'text' }
  ] }
];


// ============================================================
// OPCIONES_VACIAS
//
// Valor inicial de las opciones de los filtros, mientras la API
// responde. Cada llave corresponde a un "tipo" de filtro de
// REPORTES.
// ============================================================

const OPCIONES_VACIAS = {
  aniosVentas: [],
  aniosCompras: [],
  meses: [],
  categoriasProductos: [],
  categoriasClientes: [],
  proveedores: [],
  categoriasProveedores: []
};


// ============================================================
// descargarCSV
//
// Convierte las filas del reporte en un archivo CSV y lo descarga.
//
// - Usa como columnas las llaves de la primera fila.
// - "escapar" encierra cada valor entre comillas y duplica las
//   comillas internas, para que el CSV no se rompa.
// - El \uFEFF al inicio (BOM) permite que Excel muestre bien
//   las tildes y la ñ.
// - El nombre del archivo sale del título del reporte.
// ============================================================

function descargarCSV(filas, titulo) {
  if (!filas.length) return;

  const columnas = Object.keys(filas[0]);
  const escapar = (valor) => `"${String(valor ?? '').replaceAll('"', '""')}"`;
  const contenido = [
    columnas.map(escapar).join(','),
    ...filas.map((fila) => columnas.map((columna) => escapar(fila[columna])).join(','))
  ].join('\n');
  const archivo = new Blob([`\uFEFF${contenido}`], { type: 'text/csv;charset=utf-8' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = `${titulo.toLowerCase().replaceAll(' ', '-')}.csv`;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}


// ============================================================
// ReportesPage
//
// Página principal de reportes.
//
// Aquí se controla:
//
// - Selección del reporte a ejecutar.
// - Filtros propios de cada reporte.
// - Carga de las opciones de los filtros.
// - Ejecución del reporte y manejo de errores.
// - Exportación a CSV.
// - Estadísticas.
// - Paginación.
// ============================================================

function ReportesPage() {

  // ----------------------------------------------------------
  // REPORTE Y FILTROS
  // ----------------------------------------------------------

  // Id del reporte seleccionado (por defecto, el primero).
  const [reporteId, setReporteId] = useState(REPORTES[0].id);

  // Valores de los filtros del reporte actual.
  const [filtros, setFiltros] = useState({});

  // Opciones disponibles para los filtros (años, meses, categorías...).
  const [opciones, setOpciones] = useState(OPCIONES_VACIAS);


  // ----------------------------------------------------------
  // RESULTADOS
  // ----------------------------------------------------------

  // Filas devueltas por el reporte.
  const [filas, setFilas] = useState([]);


  // ----------------------------------------------------------
  // ESTADO DE CARGA, ERROR Y PAGINACIÓN
  // ----------------------------------------------------------

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [pagina, setPagina] = useState(1);


  // ----------------------------------------------------------
  // DATOS DERIVADOS
  // ----------------------------------------------------------

  // Reporte completo (con título y filtros) según el id seleccionado.
  const reporte = REPORTES.find((item) => item.id === reporteId);


  // ============================================================
  // PAGINACIÓN
  // ============================================================

  const totalPaginas = Math.max(1, Math.ceil(filas.length / POR_PAGINA));
  const filasMostradas = filas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  // Botones de página que se muestran alrededor de la página actual.
  const numerosPagina = Array.from({ length: totalPaginas }, (_, indice) => indice + 1)
    .slice(Math.max(0, pagina - 3), Math.min(totalPaginas, pagina + 2));


  // ============================================================
  // cargarReporte
  //
  // Ejecuta un reporte en la API con los filtros recibidos.
  // Si no se indican valores, usa el reporte y filtros actuales.
  // ============================================================

  const cargarReporte = async (id = reporteId, valores = filtros) => {
    setCargando(true);
    setError('');

    // Cada nueva consulta comienza en la página 1.
    setPagina(1);

    try {
      setFilas(await ejecutarReporte(id, valores));
    } catch (err) {
      setFilas([]);
      setError(err.message || 'No se pudo cargar el reporte.');
    } finally {
      setCargando(false);
    }
  };


  // ============================================================
  // CARGA INICIAL
  //
  // Carga las opciones de los filtros y ejecuta el primer reporte.
  // La variable "activo" evita actualizar el estado si el
  // componente se desmonta antes de que responda la API.
  // ============================================================

  useEffect(() => {
    let activo = true;

    obtenerOpcionesReportes()
      .then((datos) => {
        if (activo) setOpciones(datos);
      })
      .catch((err) => {
        if (activo) setError(err.message || 'No se pudieron cargar las opciones.');
      });

    ejecutarReporte(REPORTES[0].id, {})
      .then((datos) => {
        if (activo) setFilas(datos);
      })
      .catch((err) => {
        if (activo) setError(err.message || 'No se pudo cargar el reporte.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);


  // ============================================================
  // cambiarReporte
  //
  // Cambia el reporte seleccionado, limpia los filtros y lo
  // ejecuta de inmediato.
  // ============================================================

  const cambiarReporte = (id) => {
    setReporteId(id);
    setFiltros({});
    cargarReporte(id, {});
  };


  // ============================================================
  // restaurarFiltros
  // ============================================================

  const restaurarFiltros = () => {
    setFiltros({});
    cargarReporte(reporteId, {});
  };


  // ============================================================
  // FECHA Y HORA (formato Costa Rica, 24 horas)
  // ============================================================

  const ahora = new Date();
  const fechaTexto = ahora.toLocaleDateString('es-CR', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  });
  const horaTexto = ahora.toLocaleTimeString('es-CR', {
    hour: '2-digit', minute: '2-digit', hour12: false
  });


  // ============================================================
  // INTERFAZ
  // ============================================================

  return (
    <div>

      {/* ENCABEZADO */}

      <div className="page-header">
        <div className="title-block">
          <div className="icon-box"><BarChart3 size={22} /></div>
          <div>
            <h1>Reportes</h1>
            <p>Consulta datos estadísticos de ventas, compras e inventario.</p>
          </div>
        </div>
        <div className="header-right">
          <span>{fechaTexto} | {horaTexto}</span>
          <div className="sun-icon"><Sun size={16} /></div>
        </div>
      </div>


      {/* ESTADÍSTICAS */}

      <div className="stats-row">
        <StatCard
          icon={BarChart3}
          color="blue"
          label="Reportes disponibles"
          value={REPORTES.length}
          sub="Consultas estadísticas"
        />
        <StatCard
          icon={Database}
          color="green"
          label="Resultados"
          value={filas.length}
          sub={reporte.titulo}
        />
        <StatCard
          icon={Rows3}
          color="yellow"
          label="Página actual"
          value={`${pagina} / ${totalPaginas}`}
          sub="Filas por página: 10"
        />
      </div>


      {/* TABLA */}

      <div className="table-card">

        {/* BARRA DE HERRAMIENTAS: selector de reporte, filtros, buscar, restaurar y exportar */}

        <ReportesFiltro
          reportes={REPORTES}
          reporteId={reporteId}
          filtros={filtros}
          opciones={opciones}
          cargando={cargando}
          hayResultados={filas.length > 0}
          onCambiarReporte={cambiarReporte}
          onCambiarFiltro={(nombre, valor) => setFiltros((actuales) => ({ ...actuales, [nombre]: valor }))}
          onBuscar={() => cargarReporte()}
          onRestaurar={restaurarFiltros}
          onExportar={() => descargarCSV(filas, reporte.titulo)}
        />

        {/* CARGANDO / ERROR / TABLA / PAGINACIÓN */}

        <ReportesTabla
          filas={filas}
          cargando={cargando}
          error={error}
          pagina={pagina}
          totalPaginas={totalPaginas}
          filasMostradas={filasMostradas}
          numerosPagina={numerosPagina}
          onCambiarPagina={setPagina}
        />

      </div>

    </div>
  );
}


export default ReportesPage;