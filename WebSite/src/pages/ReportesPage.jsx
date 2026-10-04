import { useEffect, useState } from 'react';
import { BarChart3, Database, Rows3, Sun } from 'lucide-react';
import ReportesFiltro from '../components/reportes/ReportesFiltro';
import ReportesTabla from '../components/reportes/ReportesTabla';
import StatCard from '../components/StatCard';
import { ejecutarReporte, obtenerOpcionesReportes } from '../services/api';
import '../components/reportes/reportes.css';

const POR_PAGINA = 10;

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

const OPCIONES_VACIAS = {
  aniosVentas: [],
  aniosCompras: [],
  meses: [],
  categoriasProductos: [],
  categoriasClientes: [],
  proveedores: [],
  categoriasProveedores: []
};

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

function ReportesPage() {
  const [reporteId, setReporteId] = useState(REPORTES[0].id);
  const [filtros, setFiltros] = useState({});
  const [opciones, setOpciones] = useState(OPCIONES_VACIAS);
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [pagina, setPagina] = useState(1);

  const reporte = REPORTES.find((item) => item.id === reporteId);
  const totalPaginas = Math.max(1, Math.ceil(filas.length / POR_PAGINA));
  const filasMostradas = filas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const numerosPagina = Array.from({ length: totalPaginas }, (_, indice) => indice + 1)
    .slice(Math.max(0, pagina - 3), Math.min(totalPaginas, pagina + 2));

  const cargarReporte = async (id = reporteId, valores = filtros) => {
    setCargando(true);
    setError('');
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

  const cambiarReporte = (id) => {
    setReporteId(id);
    setFiltros({});
    cargarReporte(id, {});
  };

  const restaurarFiltros = () => {
    setFiltros({});
    cargarReporte(reporteId, {});
  };

  const ahora = new Date();
  const fechaTexto = ahora.toLocaleDateString('es-CR', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  });
  const horaTexto = ahora.toLocaleTimeString('es-CR', {
    hour: '2-digit', minute: '2-digit', hour12: false
  });

  return (
    <div>
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

      <div className="table-card">
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
