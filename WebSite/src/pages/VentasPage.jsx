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
import StatCard from '../components/StatCard';


// ============================================================
// FUNCIONES QUE SE COMUNICAN CON LA API
// ============================================================

import {
    listarVentas,
    obtenerDetalleVenta,
    obtenerOpcionesVentas
} from '../services/api';


// ============================================================
// CANTIDAD MÁXIMA DE VENTAS POR PÁGINA
// ============================================================

const POR_PAGINA = 10;


// ============================================================
// VentasPage
//
// Página para gestionar (consultar) las ventas registradas.
//
// - Los filtros viven dentro de VentasFiltro (acumulativos
//   entre sí: número de factura, rango de fechas, cliente
//   en texto libre, método de entrega, rango de monto).
// - Tabla de resultados, ordenada por defecto alfabéticamente
//   por nombre de cliente.
// - Al hacer click en una fila se abre el detalle completo
//   de esa venta (encabezado + líneas) en un modal aparte.
// ============================================================

function VentasPage() {

    // ============================================================
    // VENTAS
    // ============================================================

    const [ventas, setVentas] = useState([]);

    // ============================================================
    // OPCIONES PARA EL FILTRO (métodos de entrega)
    // ============================================================

    const [metodosEntrega, setMetodosEntrega] = useState([]);

    // ============================================================
    // MODAL DE DETALLE
    // ============================================================

    // null = modal cerrado. { encabezado, lineas } = modal abierto.
    const [ventaDetalle, setVentaDetalle] = useState(null);

    // ============================================================
    // ESTADO DE CARGA
    // ============================================================

    const [cargando, setCargando] = useState(false);

    // ============================================================
    // PAGINACIÓN
    // ============================================================

    const [pagina, setPagina] = useState(1);

    // ============================================================
    // MENSAJES
    // ============================================================

    const [mensaje, setMensaje] = useState(null);


    // ============================================================
    // ordenarPorCliente
    //
    // Ordena alfabéticamente por Nombre_Cliente. Se usa como
    // orden por defecto (además de que ya corregimos el SP
    // para que ordene así directamente).
    // ============================================================

    const ordenarPorCliente = (lista) => {

        return [...lista].sort((a, b) =>

            (a.Nombre_Cliente || '').localeCompare(
                b.Nombre_Cliente || '',
                'es',
                { sensitivity: 'base' }
            )
        );
    };


    // ============================================================
    // cargarVentas
    //
    // Consulta la API con los filtros recibidos desde VentasFiltro.
    // Sin argumentos, trae todo (se usa para restaurar filtros
    // y en la carga inicial).
    // ============================================================

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


    // ============================================================
    // CARGA INICIAL
    // ============================================================

    useEffect(() => {

        cargarVentas();

        obtenerOpcionesVentas()
            .then((data) => {
                setMetodosEntrega(data.metodosEntrega || []);
            })
            .catch((err) => {
                console.error(err);
            });

    }, []);


    // ============================================================
    // verDetalle
    //
    // Pide al backend el encabezado + líneas de una venta.
    // ============================================================

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
    // ESTADÍSTICAS RÁPIDAS
    // ============================================================

    const totalVentas = ventas.length;

    const montoTotal = ventas.reduce(
        (acc, v) => acc + (Number(v.Monto) || 0),
        0
    );

    const clientesUnicos = new Set(
        ventas.map((v) => v.Nombre_Cliente)
    ).size;


    // ============================================================
    // PAGINACIÓN
    // ============================================================

    const totalPaginas = Math.max(
        1,
        Math.ceil(ventas.length / POR_PAGINA)
    );

    const ventasPagina = ventas.slice(
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
            inicio = totalPaginas - maxBotones + 1;
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

            {/* ====================================================
                ENCABEZADO
            ==================================================== */}

            <div className="page-header">

                <div className="title-block">

                    <div className="icon-box">
                        <Receipt size={22} />
                    </div>

                    <div>
                        <h1>Ventas</h1>
                        <p>
                            Consulta las ventas registradas en
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


            {/* ====================================================
                ESTADÍSTICAS
            ==================================================== */}

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


            {/* ====================================================
                TABLA + FILTROS
            ==================================================== */}

            <div className="table-card">

                <VentasFiltro
                    metodosEntrega={metodosEntrega}
                    onBuscar={cargarVentas}
                    onRestaurar={() => cargarVentas()}
                />

                {/* ==================================================
                    CARGANDO / TABLA
                ================================================== */}

                {cargando ? (

                    <p style={{ padding: '1rem' }}>
                        Cargando...
                    </p>

                ) : (

                    <>

                        <VentasTabla
                            ventas={ventasPagina}
                            onVerUna={verDetalle}
                        />

                        {/* PAGINACIÓN */}

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


            {/* ====================================================
                MODAL DE DETALLE
            ==================================================== */}

            <VentaDetalleModal
                venta={ventaDetalle}
                onCerrar={() => setVentaDetalle(null)}
            />


            {/* ====================================================
                MENSAJE
            ==================================================== */}

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