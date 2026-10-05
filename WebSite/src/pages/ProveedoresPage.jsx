// ============================================================
// IMPORTACIONES DE REACT
// ============================================================

import { useEffect, useState } from 'react';


// ============================================================
// ICONOS
// ============================================================

import {
  Truck,
  CheckCircle2,
  Tag,
  Search,
  Plus,
  Sun,
  Eye
} from 'lucide-react';


// ============================================================
// COMPONENTES
// ============================================================

import ProveedoresTabla from '../components/proveedores/ProveedoresTabla';
import ProveedorDetalleModal from '../components/proveedores/ProveedorDetalleModal';
import ProveedorNuevoModal from '../components/proveedores/ProveedorNuevoModal';
import ProveedorEditarModal from '../components/proveedores/ProveedorEditarModal';
import ProveedorEliminarModal from '../components/proveedores/ProveedorEliminarModal';
import StatCard from '../components/StatCard';

// ============================================================
// FUNCIONES QUE SE COMUNICAN CON LA API
// ============================================================

import {
  listarProveedores,
  obtenerDetalleProveedores
} from '../services/api';


// ============================================================
// CANTIDAD MÁXIMA DE PROVEEDORES POR PÁGINA
// ============================================================

const POR_PAGINA = 10;


// ============================================================
// ProveedoresPage
//
// Página principal de proveedores.
//
// Aquí se controla:
//
// - Carga de proveedores.
// - Filtros (nombre, categoría, método de entrega).
// - Selección de proveedores.
// - Consulta de detalles.
// - Crear, modificar y eliminar proveedores.
// - Estadísticas.
// - Paginación.
// ============================================================

function ProveedoresPage() {

  // ----------------------------------------------------------
  // PROVEEDORES
  // ----------------------------------------------------------

  // Proveedores que se están mostrando (lista completa o filtrada).
  const [proveedores, setProveedores] = useState([]);

  // Todos los proveedores sin filtrar. Se usa para las
  // estadísticas y para las opciones de los filtros.
  const [todosProveedores, setTodosProveedores] = useState([]);


  // ----------------------------------------------------------
  // FILTROS
  // ----------------------------------------------------------

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState('');


  // ----------------------------------------------------------
  // SELECCIÓN (guarda los SupplierID marcados con checkbox)
  // ----------------------------------------------------------

  const [seleccionados, setSeleccionados] = useState([]);


  // ----------------------------------------------------------
  // MODAL DE DETALLE (null = cerrado)
  // ----------------------------------------------------------

  const [proveedoresModal, setProveedoresModal] = useState(null);


  // ----------------------------------------------------------
  // ESTADO DE CARGA Y PAGINACIÓN
  // ----------------------------------------------------------

  const [cargando, setCargando] = useState(false);
  const [pagina, setPagina] = useState(1);


  // ----------------------------------------------------------
  // MODALES DE NUEVO / EDITAR / ELIMINAR
  // ----------------------------------------------------------

  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [proveedorEditar, setProveedorEditar] = useState(null);
  const [proveedorEliminar, setProveedorEliminar] = useState(null);


  // ----------------------------------------------------------
  // MENSAJE (éxito o error)
  // ----------------------------------------------------------

  const [mensaje, setMensaje] = useState(null);


  // ============================================================
  // cargarProveedores
  //
  // Consulta la API con los filtros recibidos.
  // ============================================================

  const cargarProveedores = async (filtros = {}) => {

    setCargando(true);

    // Cada nueva búsqueda comienza en la página 1.
    setPagina(1);

    try {

      const datos = await listarProveedores(filtros);

      setProveedores(datos);

    } catch (err) {

      console.error(err);

      setMensaje({
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'Ocurrió un error al buscar los proveedores.'
      });

    } finally {

      setCargando(false);

    }
  };


  // ============================================================
  // cargarTodosProveedores
  //
  // Recarga la lista completa. Se usa después de insertar,
  // modificar o eliminar.
  // ============================================================

  const cargarTodosProveedores = async () => {

    try {

      const datos = await listarProveedores();

      setTodosProveedores(datos);

      setProveedores(datos);

      setPagina(1);

    } catch (err) {

      console.error(err);

    }

  };


  // ============================================================
  // CARGA INICIAL
  // ============================================================

  useEffect(() => {

    cargarProveedores();

    listarProveedores()
      .then((datos) => setTodosProveedores(datos))
      .catch(() => { });

  }, []);


  // ============================================================
  // aplicarFiltros
  //
  // Combina los cambios recibidos con los filtros actuales.
  // ============================================================

  const aplicarFiltros = (cambios = {}) => {

    const filtros = {

      nombre:
        cambios.nombre !== undefined
          ? cambios.nombre
          : nombre,

      categoria:
        cambios.categoria !== undefined
          ? cambios.categoria
          : categoria,

      metodoEntrega:
        cambios.metodoEntrega !== undefined
          ? cambios.metodoEntrega
          : metodoEntrega

    };

    cargarProveedores(filtros);

  };


  // ============================================================
  // restaurarFiltros
  // ============================================================

  const restaurarFiltros = () => {

    setNombre('');
    setCategoria('');
    setMetodoEntrega('');
    setSeleccionados([]);

    cargarProveedores();

  };


  // ============================================================
  // toggleSeleccion
  //
  // Agrega o quita un SupplierID de la lista de seleccionados.
  // ============================================================

  const toggleSeleccion = (id) => {

    setSeleccionados((prev) =>

      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]

    );

  };


  // ============================================================
  // verUno (botón del ojo)
  // ============================================================

  const verUno = async (id) => {

    try {

      const detalle = await obtenerDetalleProveedores(id);

      setProveedoresModal(detalle);

    } catch (err) {

      console.error(err);

      setMensaje({
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'No se pudo cargar el detalle del proveedor.'
      });

    }

  };


  // ============================================================
  // verSeleccionados
  //
  // Detalle de todos los proveedores marcados con checkbox.
  // ============================================================

  const verSeleccionados = async () => {

    try {

      const detalle = await obtenerDetalleProveedores(seleccionados);

      setProveedoresModal(detalle);

    } catch (err) {

      console.error(err);

      setMensaje({
        tipo: 'error',
        titulo: 'Error',
        mensaje:
          'No se pudo cargar el detalle de los proveedores seleccionados.'
      });

    }

  };


  // ============================================================
  // CALLBACKS DE LOS MODALES
  // ============================================================

  const proveedorCreado = async () => {

    setMostrarNuevo(false);
    setSeleccionados([]);

    await cargarTodosProveedores();

    setMensaje({
      tipo: 'exito',
      titulo: 'Proveedor creado',
      mensaje: 'El proveedor se creó correctamente.'
    });

  };

  const proveedorActualizado = async () => {

    setProveedorEditar(null);
    setSeleccionados([]);

    await cargarTodosProveedores();

    setMensaje({
      tipo: 'exito',
      titulo: 'Proveedor actualizado',
      mensaje: 'El proveedor se actualizó correctamente.'
    });

  };

  const proveedorEliminado = async () => {

    setProveedorEliminar(null);
    setSeleccionados([]);

    await cargarTodosProveedores();

    setMensaje({
      tipo: 'exito',
      titulo: 'Proveedor eliminado',
      mensaje: 'El proveedor se eliminó correctamente.'
    });

  };


  // ============================================================
  // OPCIONES DE LOS FILTROS
  //
  // new Set() elimina repetidos, filter(Boolean) elimina vacíos
  // y sort() ordena alfabéticamente.
  // ============================================================

  const categoriasDisponibles = [
    ...new Set(todosProveedores.map((p) => p.Categoria_Proveedor))
  ]
    .filter(Boolean)
    .sort();

  const metodosDisponibles = [
    ...new Set(todosProveedores.map((p) => p.Metodo_Entrega))
  ]
    .filter(Boolean)
    .sort();


  // ============================================================
  // PAGINACIÓN
  // ============================================================

  const totalPaginas = Math.max(
    1,
    Math.ceil(proveedores.length / POR_PAGINA)
  );

  const proveedoresPagina = proveedores.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA
  );

  // Máximo 5 botones de página, con la página actual al centro.
  const numerosPagina = (() => {

    const maxBotones = 5;

    if (totalPaginas <= maxBotones) {
      return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    }

    let inicio = pagina - 2;
    let fin = pagina + 2;

    if (inicio < 1) {
      inicio = 1;
      fin = maxBotones;
    }

    if (fin > totalPaginas) {
      fin = totalPaginas;
      inicio = totalPaginas - maxBotones + 1;
    }

    return Array.from(
      { length: fin - inicio + 1 },
      (_, i) => inicio + i
    );

  })();


  // ============================================================
  // FECHA Y HORA (formato Costa Rica, 24 horas)
  // ============================================================

  const ahora = new Date();

  const fechaTexto = ahora.toLocaleDateString('es-CR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const horaTexto = ahora.toLocaleTimeString('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });


  // ============================================================
  // INTERFAZ
  // ============================================================

  return (

    <div>

      {/* ENCABEZADO */}

      <div className="page-header">

        <div className="title-block">

          <div className="icon-box">
            <Truck size={22} />
          </div>

          <div>
            <h1>Proveedores</h1>
            <p>
              Consulta y busca proveedores registrados
              en Wide World Importers.
            </p>
          </div>

        </div>

        <div className="header-right">

          <span>{fechaTexto} | {horaTexto}</span>

          <div className="sun-icon">
            <Sun size={16} />
          </div>

        </div>

      </div>


      {/* ESTADÍSTICAS */}

      <div className="stats-row">

        <StatCard
          icon={Truck}
          color="blue"
          label="Total de proveedores"
          value={todosProveedores.length}
        />

        <StatCard
          icon={Tag}
          color="green"
          label="Categorías"
          value={categoriasDisponibles.length}
        />

        <StatCard
          icon={CheckCircle2}
          color="yellow"
          label="Resultados actuales"
          value={proveedores.length}
        />

      </div>


      {/* TABLA */}

      <div className="table-card">

        {/* BARRA DE HERRAMIENTAS */}

        <div className="toolbar">

          {/* Buscador: busca al presionar Enter */}

          <div className="search-box">

            <Search size={16} />

            <input
              placeholder="Buscar por nombre..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                aplicarFiltros({ nombre: e.target.value })
              }
            />

          </div>

          {/* Filtro por categoría */}

          <select
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              aplicarFiltros({ categoria: e.target.value });
            }}
          >
            <option value="">Todas las categorías</option>

            {categoriasDisponibles.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Filtro por método de entrega */}

          <select
            value={metodoEntrega}
            onChange={(e) => {
              setMetodoEntrega(e.target.value);
              aplicarFiltros({ metodoEntrega: e.target.value });
            }}
          >
            <option value="">Todos los métodos</option>

            {metodosDisponibles.map((met) => (
              <option key={met} value={met}>{met}</option>
            ))}
          </select>

          <button className="btn-restaurar" onClick={restaurarFiltros}>
            Restaurar filtros
          </button>

          <button
            className="btn-filtros"
            disabled={seleccionados.length === 0}
            onClick={verSeleccionados}
            style={{
              opacity: seleccionados.length === 0 ? 0.5 : 1,
              cursor: seleccionados.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <Eye size={16} />
            Ver seleccionados ({seleccionados.length})
          </button>

          <button className="btn-nuevo" onClick={() => setMostrarNuevo(true)}>
            <Plus size={16} />
            Nuevo Proveedor
          </button>

        </div>


        {/* CARGANDO / TABLA */}

        {cargando ? (

          <p style={{ padding: '1rem' }}>Cargando...</p>

        ) : (

          <>

            <ProveedoresTabla
              proveedores={proveedoresPagina}
              seleccionados={seleccionados}
              onToggleSeleccion={toggleSeleccion}
              onVerUno={verUno}
              onEditar={(proveedor) => setProveedorEditar(proveedor)}
              onEliminar={(proveedor) => setProveedorEliminar(proveedor)}
            />

            {/* PAGINACIÓN */}

            <div className="paginacion">

              <span>
                Mostrando{' '}
                {proveedores.length === 0
                  ? 0
                  : (pagina - 1) * POR_PAGINA + 1}
                {' - '}
                {Math.min(pagina * POR_PAGINA, proveedores.length)}
                {' de '}
                {proveedores.length}
                {' resultados'}
              </span>

              <div className="paginas">

                <button
                  disabled={pagina === 1}
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                >
                  ‹
                </button>

                {numerosPagina.map((n) => (
                  <button
                    key={n}
                    className={pagina === n ? 'activo' : ''}
                    onClick={() => setPagina(n)}
                  >
                    {n}
                  </button>
                ))}

                <button
                  disabled={pagina === totalPaginas}
                  onClick={() =>
                    setPagina((p) => Math.min(totalPaginas, p + 1))
                  }
                >
                  ›
                </button>

              </div>

            </div>

          </>

        )}

      </div>


      {/* MODAL DE DETALLE */}

      <ProveedorDetalleModal
        proveedores={proveedoresModal}
        onCerrar={() => setProveedoresModal(null)}
      />


      {/* MODAL NUEVO PROVEEDOR */}

      {mostrarNuevo && (
        <ProveedorNuevoModal
          onCerrar={() => setMostrarNuevo(false)}
          onProveedorCreado={proveedorCreado}
          onMostrarMensaje={(nuevoMensaje) => setMensaje(nuevoMensaje)}
        />
      )}


      {/* MODAL EDITAR PROVEEDOR */}

      {proveedorEditar && (
        <ProveedorEditarModal
          proveedor={proveedorEditar}
          onCerrar={() => setProveedorEditar(null)}
          onProveedorActualizado={proveedorActualizado}
          onMostrarMensaje={(nuevoMensaje) => setMensaje(nuevoMensaje)}
        />
      )}


      {/* MODAL ELIMINAR PROVEEDOR */}

      {proveedorEliminar && (
        <ProveedorEliminarModal
          proveedor={proveedorEliminar}
          onCerrar={() => setProveedorEliminar(null)}
          onEliminado={proveedorEliminado}
          onMostrarMensaje={(nuevoMensaje) => setMensaje(nuevoMensaje)}
        />
      )}


      {/* MENSAJE DE ÉXITO / ERROR */}

      {mensaje && (

        <div className="modal-overlay">

          <div className={`mensaje-modal ${mensaje.tipo}`}>

            <h2>{mensaje.titulo}</h2>

            <p>{mensaje.mensaje}</p>

            <button
              className="btn-aceptar"
              onClick={() => setMensaje(null)}
            >
              Aceptar
            </button>

          </div>

        </div>

      )}

    </div>

  );

}


export default ProveedoresPage;