// ============================================================
// FUNCIONES AUXILIARES
// ============================================================


// ============================================================
// tituloColumna
//
// Convierte el nombre de una columna de la base de datos en un
// título legible para el encabezado de la tabla.
//
// - Separa el nombre por guiones bajos (_).
// - Reemplaza "anio" por "Año".
// - Une las partes con espacios.
//
// Ejemplo: "Cantidad_Ventas" -> "Cantidad Ventas"
// ============================================================

function tituloColumna(nombre) {
  return nombre
    .split('_')
    .map((parte) => parte.toLowerCase() === 'anio' ? 'Año' : parte)
    .join(' ');
}


// ============================================================
// mostrarValor
//
// Da formato al valor de una celda según su tipo:
//
// - null o undefined: muestra un guion largo (—).
// - Números: formato en español con máximo 2 decimales.
// - Fechas en texto ISO (ej. 2024-05-10T00:00:00): se formatean
//   como fecha corta, pero solo si el nombre de la columna
//   contiene "fecha", "factura" u "orden".
// - Cualquier otro valor: se convierte a texto.
// ============================================================

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


// ============================================================
// ReportesTabla
//
// Tabla de resultados de un reporte.
//
// Aquí se controla:
//
// - Mensaje de error.
// - Estado de carga.
// - Encabezados y filas generados según las columnas del reporte.
// - Mensaje cuando no hay resultados.
// - Paginación.
//
// Recibe por props:
//
// - filas: todas las filas del reporte (sin paginar).
// - cargando: indica si se está consultando la API.
// - error: mensaje de error (vacío si no hay).
// - pagina / totalPaginas: página actual y total de páginas.
// - filasMostradas: filas de la página actual.
// - numerosPagina: botones de página a mostrar.
// - onCambiarPagina: función para cambiar de página.
// ============================================================

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

  // ----------------------------------------------------------
  // COLUMNAS
  //
  // Se toman de las llaves de la primera fila, por lo que la
  // tabla se adapta a cualquier reporte.
  // ----------------------------------------------------------

  const columnas = filas.length ? Object.keys(filas[0]) : [];


  // ============================================================
  // INTERFAZ
  // ============================================================

  return (
    <>

      {/* MENSAJE DE ERROR */}

      {error && <p className="reportes-error" role="alert">{error}</p>}


      {/* CARGANDO / TABLA / SIN RESULTADOS */}

      {cargando ? (
        <p className="reportes-estado">Cargando reporte...</p>
      ) : filas.length ? (
        <div className="table-responsive">
          <table className="tabla-clientes reportes-tabla">

            {/* ENCABEZADOS */}

            <thead>
              <tr>
                {columnas.map((columna) => (
                  <th key={columna}>{tituloColumna(columna)}</th>
                ))}
              </tr>
            </thead>

            {/* FILAS (solo las de la página actual) */}

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


      {/* PAGINACIÓN */}

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