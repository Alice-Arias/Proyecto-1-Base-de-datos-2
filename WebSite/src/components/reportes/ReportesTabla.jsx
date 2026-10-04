function tituloColumna(nombre) {
  return nombre
    .split('_')
    .map((parte) => parte.toLowerCase() === 'anio' ? 'Año' : parte)
    .join(' ');
}

function mostrarValor(valor, columna) {
  if (valor === null || valor === undefined) return '—';

  if (typeof valor === 'number') {
    return new Intl.NumberFormat('es', { maximumFractionDigits: 2 }).format(valor);
  }

  if (
    typeof valor === 'string' &&
    /^\d{4}-\d{2}-\d{2}T/.test(valor) &&
    /fecha|factura|orden/i.test(columna)
  ) {
    return new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(new Date(valor));
  }

  return String(valor);
}

function ReportesTabla({
  filas,
  cargando,
  error,
  pagina,
  totalPaginas,
  filasMostradas,
  numerosPagina,
  onCambiarPagina
}) {
  const columnas = filas.length ? Object.keys(filas[0]) : [];

  return (
    <>
      {error && <p className="reportes-error" role="alert">{error}</p>}

      {cargando ? (
        <p className="reportes-estado">Cargando reporte...</p>
      ) : filas.length ? (
        <div className="table-responsive">
          <table className="tabla-clientes reportes-tabla">
            <thead>
              <tr>
                {columnas.map((columna) => (
                  <th key={columna}>{tituloColumna(columna)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filasMostradas.map((fila, indice) => (
                <tr key={`${pagina}-${indice}`}>
                  {columnas.map((columna) => {
                    const texto = mostrarValor(fila[columna], columna);
                    return (
                      <td key={columna}>
                        <span className="reportes-celda" title={texto}>
                          {texto}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="reportes-estado">
          {error ? 'No se pudo completar el reporte.' : 'No se encontraron resultados.'}
        </p>
      )}

      {!cargando && filas.length > 0 && (
        <div className="paginacion">
          <span>
            Mostrando {(pagina - 1) * 10 + 1} - {Math.min(pagina * 10, filas.length)} de {filas.length} resultados
          </span>
          <div className="paginas">
            <button disabled={pagina === 1} onClick={() => onCambiarPagina(pagina - 1)} type="button">‹</button>
            {numerosPagina.map((numero) => (
              <button
                className={pagina === numero ? 'activo' : ''}
                key={numero}
                onClick={() => onCambiarPagina(numero)}
                type="button"
              >
                {numero}
              </button>
            ))}
            <button disabled={pagina === totalPaginas} onClick={() => onCambiarPagina(pagina + 1)} type="button">›</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportesTabla;