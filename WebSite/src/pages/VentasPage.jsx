// ============================================================
// IMPORTACIONES DE REACT
// ============================================================

import { useEffect, useState } from 'react';


// ============================================================
// ICONOS
// ============================================================

import {
    Receipt,
    DollarSign,
    FileText,
    Sun
} from 'lucide-react';


// ============================================================
// COMPONENTES
// ============================================================

import VentasFiltro from '../components/ventas/VentasFiltro';
import VentasTabla from '../components/ventas/VentasTabla';
import VentaDetalleModal from '../components/ventas/VentaDetalleModal';
import VentaNuevoModal from '../components/ventas/VentaNuevoModal';
import VentaEditarModal from '../components/ventas/VentaEditarModal';
import VentaEliminarModal from '../components/ventas/VentaEliminarModal';
import StatCard from '../components/StatCard';


// ============================================================
// FUNCIONES QUE SE COMUNICAN CON LA API
// ============================================================

import {
    listarVentas,
    obtenerDetalleVenta,
    obtenerOpcionesVentas
} from '../services/api';


const POR_PAGINA = 10;


function VentasPage() {

    const [ventas, setVentas] = useState([]);
    const [metodosEntrega, setMetodosEntrega] = useState([]);

    // Modal de detalle (solo lectura)
    const [ventaDetalle, setVentaDetalle] = useState(null);

    // Modal de nueva venta
    const [mostrarNuevo, setMostrarNuevo] = useState(false);

    // Venta a editar (null = modal cerrado)
    const [ventaEditar, setVentaEditar] = useState(null);

    // Venta a eliminar (null = modal cerrado)
    const [ventaEliminar, setVentaEliminar] = useState(null);

    const [cargando, setCargando] = useState(false);
    const [pagina, setPagina] = useState(1);
    const [mensaje, setMensaje] = useState(null);


    const ordenarPorCliente = (lista) => {

        return [...lista].sort((a, b) =>

            (a.Nombre_Cliente || '').localeCompare(
                b.Nombre_Cliente || '',
                'es',
                { sensitivity: 'base' }
            )
        );
    };


    const cargarVentas = async (filtros = {}) => {

        setCargando(true);
        setPagina(1);

        try {

            const datos = await listarVentas(filtros);
            setVentas(ordenarPorCliente(datos));

        } catch (err) {

            console.error(err);

            setMensaje({
                tipo: 'error',
                titulo: 'Error',
                mensaje: 'Ocurrió un error al buscar las ventas.'
            });

        } finally {

            setCargando(false);
        }
    };


    const cargarMetodosEntrega = () => {

        obtenerOpcionesVentas()
            .then((data) => {
                setMetodosEntrega(data.metodosEntrega || []);
            })
            .catch((err) => {
                console.error(err);
            });
    };


    useEffect(() => {

        cargarVentas();
        cargarMetodosEntrega();

    }, []);


    const verDetalle = async (invoiceId) => {

        try {

            const detalle = await obtenerDetalleVenta(invoiceId);
            setVentaDetalle(detalle);

        } catch (err) {

            console.error(err);

            setMensaje({
                tipo: 'error',
                titulo: 'Error',
                mensaje: 'No se pudo cargar el detalle de la venta.'
            });
        }
    };


    // ============================================================
    // VENTA CREADA
    // ============================================================

    const ventaCreada = async () => {

        setMostrarNuevo(false);

        await cargarVentas();

        setMensaje({
            tipo: 'exito',
            titulo: 'Venta creada',
            mensaje: 'La venta se creó correctamente.'
        });
    };


    // ============================================================
    // VENTA ACTUALIZADA
    // ============================================================

    const ventaActualizada = async () => {

        setVentaEditar(null);

        await cargarVentas();

        setMensaje({
            tipo: 'exito',
            titulo: 'Venta actualizada',
            mensaje: 'La venta se actualizó correctamente.'
        });
    };


    // ============================================================
    // VENTA ELIMINADA
    // ============================================================

    const ventaEliminada = async () => {

        setVentaEliminar(null);

        await cargarVentas();

        setMensaje({
            tipo: 'exito',
            titulo: 'Venta eliminada',
            mensaje: 'La venta se eliminó correctamente.'
        });
    };


    const totalVentas = ventas.length;

    const montoTotal = ventas.reduce(
        (acc, v) => acc + (Number(v.Monto) || 0),
        0
    );

    const clientesUnicos = new Set(
        ventas.map((v) => v.Nombre_Cliente)
    ).size;


    const totalPaginas = Math.max(
        1,
        Math.ceil(ventas.length / POR_PAGINA)
    );

    const ventasPagina = ventas.slice(
        (pagina - 1) * POR_PAGINA,
        pagina * POR_PAGINA
    );


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
            inicio = totalPaginas - maxBotones + 1;
        }

        return Array.from(
            { length: fin - inicio + 1 },
            (_, i) => inicio + i
        );

    })();


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


    return (

        <div>

            <div className="page-header">

                <div className="title-block">

                    <div className="icon-box">
                        <Receipt size={22} />
                    </div>

                    <div>
                        <h1>Ventas</h1>
                        <p>
                            Gestiona las ventas registradas en
                            Wide World Importers.
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


            <div className="stats-row">

                <StatCard
                    icon={Receipt}
                    color="blue"
                    label="Ventas encontradas"
                    value={totalVentas}
                />

                <StatCard
                    icon={DollarSign}
                    color="green"
                    label="Monto total"
                    value={montoTotal.toLocaleString('es-CR', {
                        style: 'currency',
                        currency: 'USD'
                    })}
                />

                <StatCard
                    icon={FileText}
                    color="yellow"
                    label="Clientes distintos"
                    value={clientesUnicos}
                />

            </div>


            <div className="table-card">

                <VentasFiltro
                    metodosEntrega={metodosEntrega}
                    onBuscar={cargarVentas}
                    onRestaurar={() => cargarVentas()}
                    onNuevo={() => setMostrarNuevo(true)}
                />

                {cargando ? (

                    <p style={{ padding: '1rem' }}>
                        Cargando...
                    </p>

                ) : (

                    <>

                        <VentasTabla
                            ventas={ventasPagina}
                            onVerUna={verDetalle}
                            onEditar={(v) => setVentaEditar(v)}
                            onEliminar={(v) => setVentaEliminar(v)}
                        />

                        <div className="paginacion">

                            <span>

                                Mostrando{' '}
                                {ventas.length === 0
                                    ? 0
                                    : (pagina - 1) * POR_PAGINA + 1}
                                {' - '}
                                {Math.min(pagina * POR_PAGINA, ventas.length)}
                                {' de '}
                                {ventas.length}
                                {' resultados'}

                            </span>

                            <div className="paginas">

                                <button
                                    disabled={pagina === 1}
                                    onClick={() =>
                                        setPagina((p) => Math.max(1, p - 1))
                                    }
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
                                        setPagina((p) =>
                                            Math.min(totalPaginas, p + 1)
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


            {/* Detalle de solo lectura */}
            <VentaDetalleModal
                venta={ventaDetalle}
                onCerrar={() => setVentaDetalle(null)}
            />


            {/* Nueva venta */}
            {mostrarNuevo && (

                <VentaNuevoModal
                    onCerrar={() => setMostrarNuevo(false)}
                    onVentaCreada={ventaCreada}
                    onMostrarMensaje={(m) => setMensaje(m)}
                />

            )}


            {/* Editar venta */}
            {ventaEditar && (

                <VentaEditarModal
                    venta={ventaEditar}
                    onCerrar={() => setVentaEditar(null)}
                    onVentaActualizada={ventaActualizada}
                    onMostrarMensaje={(m) => setMensaje(m)}
                />

            )}


            {/* Eliminar venta */}
            {ventaEliminar && (

                <VentaEliminarModal
                    venta={ventaEliminar}
                    onCerrar={() => setVentaEliminar(null)}
                    onEliminado={ventaEliminada}
                />

            )}


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


export default VentasPage;