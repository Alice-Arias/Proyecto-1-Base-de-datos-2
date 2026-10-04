import { Download, FileBarChart2, RotateCcw } from 'lucide-react';

function ReportesFiltro({
  reportes,
  reporteId,
  filtros,
  opciones,
  cargando,
  hayResultados,
  onCambiarReporte,
  onCambiarFiltro,
  onBuscar,
  onRestaurar,
  onExportar
}) {
  const reporte = reportes.find((item) => item.id === reporteId);

  const opcionesDeFiltro = (tipo) => {
    if (tipo === 'aniosVentas' || tipo === 'aniosCompras') {
      const anios = tipo === 'aniosVentas'
        ? opciones.aniosVentas
        : opciones.aniosCompras;

      return anios.map(({ Anio }) => ({ valor: Anio, nombre: Anio }));
    }

    return (opciones[tipo] || []).map((opcion) => ({
      valor: tipo === 'meses' ? opcion.ID : opcion.Nombre,
      nombre: opcion.Nombre
    }));
  };

  return (
    <form
      className="toolbar reportes-toolbar"
      onSubmit={(event) => {
        event.preventDefault();
        onBuscar();
      }}
    >
      <select
        aria-label="Tipo de reporte"
        value={reporteId}
        onChange={(event) => onCambiarReporte(event.target.value)}
      >
        {reportes.map((item) => (
          <option key={item.id} value={item.id}>{item.grupo}: {item.titulo}</option>
        ))}
      </select>

      {reporte.filtros.map((campo) => (
        campo.tipo === 'text' ? (
          <input
            className="reportes-filtro-texto"
            key={campo.id}
            aria-label={campo.label}
            placeholder={`${campo.label}...`}
            value={filtros[campo.id] || ''}
            onChange={(event) => onCambiarFiltro(campo.id, event.target.value)}
          />
        ) : (
          <select
            key={campo.id}
            aria-label={campo.label}
            value={filtros[campo.id] || ''}
            onChange={(event) => onCambiarFiltro(campo.id, event.target.value)}
          >
            <option value="">Todos: {campo.label}</option>
            {opcionesDeFiltro(campo.tipo).map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>{opcion.nombre}</option>
            ))}
          </select>
        )
      ))}

      <button className="btn-filtros" disabled={cargando} type="submit">
        <FileBarChart2 size={16} />
        Generar reporte
      </button>

      <button className="btn-restaurar" onClick={onRestaurar} type="button">
        <RotateCcw size={15} />
        Restaurar
      </button>

      <button
        className="btn-restaurar reportes-descargar"
        disabled={!hayResultados || cargando}
        onClick={onExportar}
        type="button"
        title="Descargar resultados como CSV"
      >
        <Download size={15} />
        CSV
      </button>
    </form>
  );
}

export default ReportesFiltro;