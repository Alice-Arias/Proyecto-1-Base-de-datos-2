// ============================================================
// IMPORTACIONES DE REACT
// ============================================================

import { useEffect, useState } from 'react';


// ============================================================
// ICONOS
// ============================================================

import {
    Package,
    Layers,
    CheckCircle2,
    Search,
    Plus,
    Sun,
    Eye
} from 'lucide-react';


// ============================================================
// COMPONENTES
// ============================================================

import InventariosTabla from '../components/inventario/InventariosTabla';
import InventarioDetalleModal from '../components/inventario/InventarioDetalleModal';
import InventarioNuevoModal from '../components/inventario/InventarioNuevoModal';
import InventarioEditarModal from '../components/inventario/InventarioEditarModal';
import InventarioEliminarModal from '../components/inventario/InventarioEliminarModal';
import StatCard from '../components/StatCard';


// ============================================================
// FUNCIONES QUE SE COMUNICAN CON LA API
// ============================================================

import {
    listarInventarios,
    obtenerDetalleInventarios
} from '../services/api';


// ============================================================
// CANTIDAD MÁXIMA DE PRODUCTOS POR PÁGINA
// ============================================================

const POR_PAGINA = 10;


// ============================================================
// InventariosPage
//
// Esta es la página principal de inventario.
//
// Aquí se controla:
//
// - Carga de productos.
// - Filtros (nombre y grupo).
// - Selección de productos.
// - Consulta de detalles.
// - Crear productos.
// - Modificar productos.
// - Eliminar productos.
// - Estadísticas.
// - Paginación.
// - Estado de carga.
//
// ============================================================

function InventariosPage() {

    // ============================================================
    // INVENTARIOS
    // ============================================================

    // Productos que actualmente se están mostrando.
    const [inventarios, setInventarios] = useState([]);

    // Guarda todos los productos sin filtrar.
    //
    // Se utiliza para obtener los grupos disponibles
    // y para calcular las estadísticas.
    const [todosInventarios, setTodosInventarios] = useState([]);


    // ============================================================
    // FILTROS
    // ============================================================

    // Texto escrito en el filtro de nombre.
    const [nombre, setNombre] = useState('');

    // Grupo seleccionado.
    const [grupo, setGrupo] = useState('');


    // ============================================================
    // SELECCIÓN DE PRODUCTOS
    // ============================================================

    // Guarda los StockItemID seleccionados.
    const [seleccionados, setSeleccionados] = useState([]);


    // ============================================================
    // MODAL DE DETALLE
    // ============================================================

    // Guarda los productos que se mostrarán en el modal.
    //
    // null significa que el modal está cerrado.
    const [inventariosModal, setInventariosModal] =
        useState(null);


    // ============================================================
    // ESTADO DE CARGA
    // ============================================================

    const [cargando, setCargando] = useState(false);


    // ============================================================
    // PAGINACIÓN
    // ============================================================

    const [pagina, setPagina] = useState(1);


    // ============================================================
    // MODAL NUEVO INVENTARIO
    // ============================================================

    const [mostrarNuevo, setMostrarNuevo] = useState(false);


    // ============================================================
    // PRODUCTO PARA EDITAR
    // ============================================================

    const [inventarioEditar, setInventarioEditar] =
        useState(null);


    // ============================================================
    // PRODUCTO PARA ELIMINAR
    // ============================================================

    const [inventarioEliminar, setInventarioEliminar] =
        useState(null);


    // ============================================================
    // MENSAJES
    // ============================================================

    const [mensaje, setMensaje] = useState(null);


    // ============================================================
    // cargarInventarios
    //
    // Consulta la API para obtener los productos.
    //
    // Puede recibir filtros.
    // ============================================================

    const cargarInventarios = async (filtros = {}) => {

        setCargando(true);
        setPagina(1);

        try {

            const datos =
                await listarInventarios(filtros);

            setInventarios(datos);

        } catch (err) {

            console.error(err);

            setMensaje({
                tipo: 'error',
                titulo: 'Error',
                mensaje:
                    'Ocurrió un error al buscar los productos.'
            });

        } finally {

            setCargando(false);
        }
    };


    // ============================================================
    // cargarTodosInventarios
    //
    // Vuelve a cargar todos los productos.
    //
    // Se utiliza después de insertar, modificar o eliminar.
    // ============================================================

    const cargarTodosInventarios = async () => {

        try {

            const datos =
                await listarInventarios();

            setTodosInventarios(datos);
            setInventarios(datos);

            // Después de actualizar la lista volvemos
            // a la primera página.
            setPagina(1);

        } catch (err) {

            console.error(err);

            setMensaje({
                tipo: 'error',
                titulo: 'Error',
                mensaje:
                    'No se pudieron cargar los productos.'
            });
        }
    };


    // ============================================================
    // CARGA INICIAL
    // ============================================================

    useEffect(() => {

        cargarInventarios();

        listarInventarios()
            .then((datos) => {
                setTodosInventarios(datos);
            })
            .catch((err) => {
                console.error(err);
            });

    }, []);


    // ============================================================
    // aplicarFiltros
    //
    // Combina los filtros nuevos con los que ya estaban activos.
    // ============================================================

    const aplicarFiltros = (cambios = {}) => {

        const filtros = {

            nombre:
                cambios.nombre !== undefined
                    ? cambios.nombre
                    : nombre,

            grupo:
                cambios.grupo !== undefined
                    ? cambios.grupo
                    : grupo
        };

        // Guardamos los valores utilizados para la búsqueda.
        setNombre(filtros.nombre);
        setGrupo(filtros.grupo);

        setSeleccionados([]);

        cargarInventarios(filtros);
    };


    // ============================================================
    // restaurarFiltros
    // ============================================================

    const restaurarFiltros = () => {

        setNombre('');
        setGrupo('');

        setSeleccionados([]);

        cargarInventarios();
    };


    // ============================================================
    // toggleSeleccion
    //
    // Selecciona o deselecciona un producto.
    // ============================================================

    const toggleSeleccion = (id) => {

        setSeleccionados((prev) =>

            prev.includes(id)

                ? prev.filter((x) => x !== id)

                : [...prev, id]
        );
    };


    // ============================================================
    // verUno
    //
    // Obtiene el detalle de un producto.
    // ============================================================

    const verUno = async (id) => {

        try {

            const detalle =
                await obtenerDetalleInventarios(id);

            setInventariosModal(detalle);

        } catch (err) {

            console.error(err);

            setMensaje({
                tipo: 'error',
                titulo: 'Error',
                mensaje:
                    'No se pudo cargar el detalle del producto.'
            });
        }
    };


    // ============================================================
    // verSeleccionados
    //
    // Obtiene los detalles de todos los productos seleccionados.
    // ============================================================

    const verSeleccionados = async () => {

        if (seleccionados.length === 0) {
            return;
        }

        try {

            const detalle =
                await obtenerDetalleInventarios(
                    seleccionados
                );

            setInventariosModal(detalle);

        } catch (err) {

            console.error(err);

            setMensaje({
                tipo: 'error',
                titulo: 'Error',
                mensaje:
                    'No se pudo cargar el detalle de los productos seleccionados.'
            });
        }
    };


    // ============================================================
    // INVENTARIO CREADO
    // ============================================================

    const inventarioCreado = async () => {

        setMostrarNuevo(false);
        setSeleccionados([]);

        await cargarTodosInventarios();

        setMensaje({
            tipo: 'exito',
            titulo: 'Producto creado',
            mensaje:
                'El producto se creó correctamente.'
        });
    };


    // ============================================================
    // INVENTARIO ACTUALIZADO
    // ============================================================

    const inventarioActualizado = async () => {

        setInventarioEditar(null);
        setSeleccionados([]);

        await cargarTodosInventarios();

        setMensaje({
            tipo: 'exito',
            titulo: 'Producto actualizado',
            mensaje:
                'El producto se actualizó correctamente.'
        });
    };


    // ============================================================
    // INVENTARIO ELIMINADO
    // ============================================================

    const inventarioEliminado = async () => {

        setInventarioEliminar(null);
        setSeleccionados([]);

        await cargarTodosInventarios();

        setMensaje({
            tipo: 'exito',
            titulo: 'Producto eliminado',
            mensaje:
                'El producto se eliminó correctamente.'
        });
    };


    // ============================================================
    // GRUPOS DISPONIBLES
    //
    // El SP devuelve los grupos unidos mediante STRING_AGG.
    //
    // Por ejemplo:
    //
    // "Beverages, Chocolate"
    //
    // Separamos nuevamente los grupos para obtener
    // las opciones disponibles.
    // ============================================================

    const gruposDisponibles = [
        ...new Set(

            todosInventarios.flatMap((p) =>

                (p.Grupo || '')
                    .split(',')
                    .map((g) => g.trim())
                    .filter(Boolean)
            )
        )
    ].sort();


    // ============================================================
    // PAGINACIÓN
    // ============================================================

    const totalPaginas = Math.max(
        1,
        Math.ceil(
            inventarios.length / POR_PAGINA
        )
    );


    const inventariosPagina =
        inventarios.slice(
            (pagina - 1) * POR_PAGINA,
            pagina * POR_PAGINA
        );


    // ============================================================
    // NÚMEROS DE PÁGINA DINÁMICOS
    // ============================================================

    const numerosPagina = (() => {

        const maxBotones = 5;

        if (totalPaginas <= maxBotones) {

            return Array.from(
                { length: totalPaginas },
                (_, i) => i + 1
            );
        }

        let inicio = pagina - 2;
        let fin = pagina + 2;

        if (inicio < 1) {

            inicio = 1;
            fin = maxBotones;
        }

        if (fin > totalPaginas) {

            fin = totalPaginas;
            inicio =
                totalPaginas - maxBotones + 1;
        }

        return Array.from(
            { length: fin - inicio + 1 },
            (_, i) => inicio + i
        );

    })();


    // ============================================================
    // FECHA Y HORA
    // ============================================================

    const ahora = new Date();

    const fechaTexto =
        ahora.toLocaleDateString(
            'es-CR',
            {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );

    const horaTexto =
        ahora.toLocaleTimeString(
            'es-CR',
            {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }
        );


    // ============================================================
    // INTERFAZ
    // ============================================================

    return (

        <div>

            {/* ====================================================
                ENCABEZADO
                ==================================================== */}

            <div className="page-header">

                <div className="title-block">

                    <div className="icon-box">
                        <Package size={22} />
                    </div>

                    <div>

                        <h1>
                            Inventario
                        </h1>

                        <p>
                            Consulta y administra los productos
                            registrados en Wide World Importers.
                        </p>

                    </div>

                </div>


                <div className="header-right">

                    <span>
                        {fechaTexto} | {horaTexto}
                    </span>

                    <div className="sun-icon">
                        <Sun size={16} />
                    </div>

                </div>

            </div>


            {/* ====================================================
                ESTADÍSTICAS
                ==================================================== */}

            <div className="stats-row">

                <StatCard
                    icon={Package}
                    color="blue"
                    label="Total de productos"
                    value={todosInventarios.length}
                />

                <StatCard
                    icon={Layers}
                    color="green"
                    label="Grupos"
                    value={gruposDisponibles.length}
                />

                <StatCard
                    icon={CheckCircle2}
                    color="yellow"
                    label="Resultados actuales"
                    value={inventarios.length}
                />

            </div>


            {/* ====================================================
                TABLA
                ==================================================== */}

            <div className="table-card">

                {/* ==================================================
                    BARRA DE HERRAMIENTAS
                    ================================================== */}

                <div className="toolbar">


                    {/* BUSCADOR */}

                    <div className="search-box">

                        <Search size={16} />

                        <input
                            placeholder="Buscar por nombre..."
                            value={nombre}
                            onChange={(e) =>
                                setNombre(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (e.key === 'Enter') {

                                    aplicarFiltros({
                                        nombre:
                                            e.target.value
                                    });
                                }
                            }}
                        />

                    </div>


                    {/* FILTRO GRUPO */}

                    <select
                        value={grupo}
                        onChange={(e) => {

                            const valor =
                                e.target.value;

                            setGrupo(valor);

                            aplicarFiltros({
                                grupo: valor
                            });
                        }}
                    >

                        <option value="">
                            Todos los grupos
                        </option>

                        {gruposDisponibles.map((g) => (

                            <option
                                key={g}
                                value={g}
                            >
                                {g}
                            </option>

                        ))}

                    </select>


                    {/* RESTAURAR FILTROS */}

                    <button
                        className="btn-restaurar"
                        onClick={restaurarFiltros}
                    >
                        Restaurar filtros
                    </button>


                    {/* VER SELECCIONADOS */}

                    <button
                        className="btn-filtros"
                        disabled={
                            seleccionados.length === 0
                        }
                        onClick={verSeleccionados}
                        style={{
                            opacity:
                                seleccionados.length === 0
                                    ? 0.5
                                    : 1,

                            cursor:
                                seleccionados.length === 0
                                    ? 'not-allowed'
                                    : 'pointer'
                        }}
                    >

                        <Eye size={16} />

                        Ver seleccionados (
                        {seleccionados.length}
                        )

                    </button>


                    {/* NUEVO PRODUCTO */}

                    <button
                        className="btn-nuevo"
                        onClick={() =>
                            setMostrarNuevo(true)
                        }
                    >

                        <Plus size={16} />

                        Nuevo Producto

                    </button>

                </div>


                {/* ==================================================
                    CARGANDO / TABLA
                    ================================================== */}

                {cargando ? (

                    <p style={{ padding: '1rem' }}>
                        Cargando...
                    </p>

                ) : (

                    <>

                        {/* TABLA DE INVENTARIOS */}

                        <InventariosTabla
                            inventarios={
                                inventariosPagina
                            }

                            seleccionados={
                                seleccionados
                            }

                            onToggleSeleccion={
                                toggleSeleccion
                            }

                            onVerUno={
                                verUno
                            }

                            onEditar={
                                (inventario) =>
                                    setInventarioEditar(
                                        inventario
                                    )
                            }

                            onEliminar={
                                (inventario) =>
                                    setInventarioEliminar(
                                        inventario
                                    )
                            }
                        />


                        {/* PAGINACIÓN */}

                        <div className="paginacion">

                            <span>

                                Mostrando{' '}

                                {inventarios.length === 0
                                    ? 0
                                    : (pagina - 1) *
                                      POR_PAGINA + 1}

                                {' - '}

                                {Math.min(
                                    pagina * POR_PAGINA,
                                    inventarios.length
                                )}

                                {' de '}

                                {inventarios.length}

                                {' resultados'}

                            </span>


                            <div className="paginas">


                                {/* ANTERIOR */}

                                <button
                                    disabled={
                                        pagina === 1
                                    }
                                    onClick={() =>
                                        setPagina(
                                            (p) =>
                                                Math.max(
                                                    1,
                                                    p - 1
                                                )
                                        )
                                    }
                                >
                                    ‹
                                </button>


                                {/* NÚMEROS */}

                                {numerosPagina.map((n) => (

                                    <button
                                        key={n}
                                        className={
                                            pagina === n
                                                ? 'activo'
                                                : ''
                                        }
                                        onClick={() =>
                                            setPagina(n)
                                        }
                                    >
                                        {n}
                                    </button>

                                ))}


                                {/* SIGUIENTE */}

                                <button
                                    disabled={
                                        pagina ===
                                        totalPaginas
                                    }
                                    onClick={() =>
                                        setPagina(
                                            (p) =>
                                                Math.min(
                                                    totalPaginas,
                                                    p + 1
                                                )
                                        )
                                    }
                                >
                                    ›
                                </button>

                            </div>

                        </div>

                    </>

                )}

            </div>


            {/* ====================================================
                MODAL DE DETALLE
                ==================================================== */}

            <InventarioDetalleModal
                inventarios={
                    inventariosModal
                }

                onCerrar={() =>
                    setInventariosModal(null)
                }
            />


            {/* ====================================================
                MODAL NUEVO
                ==================================================== */}

            {mostrarNuevo && (

                <InventarioNuevoModal

                    onCerrar={() =>
                        setMostrarNuevo(false)
                    }

                    onInventarioCreado={
                        inventarioCreado
                    }

                    onMostrarMensaje={
                        (nuevoMensaje) => {
                            setMensaje(
                                nuevoMensaje
                            );
                        }
                    }

                />

            )}


            {/* ====================================================
                MODAL EDITAR
                ==================================================== */}

            {inventarioEditar && (

                <InventarioEditarModal

                    inventario={
                        inventarioEditar
                    }

                    onCerrar={() =>
                        setInventarioEditar(null)
                    }

                    onInventarioActualizado={
                        inventarioActualizado
                    }

                    onMostrarMensaje={
                        (nuevoMensaje) => {
                            setMensaje(
                                nuevoMensaje
                            );
                        }
                    }

                />

            )}


            {/* ====================================================
                MODAL ELIMINAR
                ==================================================== */}

            {inventarioEliminar && (

                <InventarioEliminarModal

                    inventario={
                        inventarioEliminar
                    }

                    onCerrar={() =>
                        setInventarioEliminar(null)
                    }

                    onEliminado={
                        inventarioEliminado
                    }

                    onMostrarMensaje={
                        (nuevoMensaje) => {
                            setMensaje(
                                nuevoMensaje
                            );
                        }
                    }

                />

            )}


            {/* ====================================================
                MENSAJE
                ==================================================== */}

            {mensaje && (

                <div className="modal-overlay">

                    <div
                        className={`mensaje-modal ${mensaje.tipo}`}
                    >

                        <h2>
                            {mensaje.titulo}
                        </h2>

                        <p>
                            {mensaje.mensaje}
                        </p>

                        <button
                            className="btn-aceptar"
                            onClick={() =>
                                setMensaje(null)
                            }
                        >
                            Aceptar
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}


export default InventariosPage;