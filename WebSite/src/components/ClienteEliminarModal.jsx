
import {
    Trash2,
    Eye,
    User,
    CheckCircle2,
    XCircle
} from 'lucide-react';

import { useState } from 'react';

import {
    eliminarCliente,
    obtenerDetalleClientes
} from '../services/api';
import ClienteDetalleModal from './ClienteDetalleModal';


function ClienteEliminarModal({
    cliente,
    onCerrar,
    onEliminado
}) {

    // 'confirmar' | 'eliminando' | 'exito' | 'error'
    const [estado, setEstado] = useState('confirmar');

    // Mensaje de error devuelto por el backend, si lo hay.
    const [mensajeError, setMensajeError] = useState('');

    // Controla si el modal de detalle está abierto encima de este.
    const [verDetalle, setVerDetalle] = useState(false);

    // Detalle COMPLETO del cliente (distinto del objeto "resumen"
    // que llega de la lista). Se pide recién al tocar el ojo.
    const [detalleCompleto, setDetalleCompleto] = useState(null);

    // Indica si el detalle todavía se está cargando.
    const [cargandoDetalle, setCargandoDetalle] = useState(false);


    if (!cliente) {
        return null;
    }


    // ========================================================
    // ELIMINAR CLIENTE
    // ========================================================

    const confirmarEliminacion = async () => {

        setEstado('eliminando');

        try {

            await eliminarCliente(cliente.CustomerID);

            setEstado('exito');

        } catch (error) {

            console.error(error);

            setMensajeError(
                error.message ||
                'No se pudo eliminar el cliente.'
            );

            setEstado('error');

        }
    };


    // ========================================================
    // CERRAR DESPUÉS DE UN ÉXITO
    // ========================================================

    const cerrarConExito = async () => {

        if (onEliminado) {
            await onEliminado(cliente.CustomerID);
        }

    };


    // ========================================================
    // ABRIR EL DETALLE COMPLETO (pide los datos completos al
    // backend antes de mostrar el modal, en vez de reusar el
    // objeto resumido que trae la lista)
    // ========================================================

    const abrirDetalle = async () => {

        setCargandoDetalle(true);

        try {

            const data = await obtenerDetalleClientes(
                cliente.CustomerID
            );

            // obtenerDetalleClientes devuelve un arreglo
            // (puede pedir varios IDs a la vez).
            setDetalleCompleto(data);
            setVerDetalle(true);

        } catch (error) {

            console.error(error);

            setMensajeError(
                'No se pudo cargar la información del cliente.'
            );
            setEstado('error');

        } finally {

            setCargandoDetalle(false);

        }

    };


    // ========================================================
    // ESTADO: CONFIRMAR / ELIMINANDO
    // Usa .modal-confirmacion, ya definido en tu CSS.
    // ========================================================

    if (estado === 'confirmar' || estado === 'eliminando') {

        return (

            <>

                <div className="modal-fondo" onClick={onCerrar}>

                    <div
                        className="modal-confirmacion"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="confirmacion-icono">
                            <Trash2 size={28} />
                        </div>

                        <h2>¿Desea eliminar este cliente?</h2>
                        <p>Esta acción no se puede deshacer.</p>

                        {/* Nombre del cliente + botón para ver el detalle */}
                        <div className="confirmacion-cliente-tarjeta">

                            <div className="confirmacion-cliente-info">

                                <span className="confirmacion-cliente-avatar">
                                    <User size={17} />
                                </span>

                                <span className="confirmacion-cliente-nombre">
                                    {cliente.Nombre_Cliente}
                                </span>

                            </div>

                            <button
                                type="button"
                                className="btn-ojo"
                                onClick={abrirDetalle}
                                disabled={cargandoDetalle}
                                title="Ver información del cliente"
                                aria-label="Ver información del cliente"
                            >
                                <Eye size={16} />
                                {cargandoDetalle ? 'Cargando...' : 'Ver detalle'}
                            </button>

                        </div>

                        <div className="confirmacion-botones">

                            <button
                                type="button"
                                className="btn-cancelar"
                                onClick={onCerrar}
                                disabled={estado === 'eliminando'}
                            >
                                No, cancelar
                            </button>

                            <button
                                type="button"
                                className="btn-eliminar"
                                onClick={confirmarEliminacion}
                                disabled={estado === 'eliminando'}
                            >
                                {estado === 'eliminando'
                                    ? 'Eliminando...'
                                    : 'Sí, eliminar'}
                            </button>

                        </div>

                    </div>

                </div>

                {verDetalle && detalleCompleto && (

                    <ClienteDetalleModal
                        clientes={detalleCompleto}
                        onCerrar={() => setVerDetalle(false)}
                    />

                )}

            </>

        );

    }


    // ========================================================
    // ESTADO: ÉXITO
    // Usa .mensaje-modal.exito, ya definido en tu CSS.
    // ========================================================

    if (estado === 'exito') {

        return (

            <div className="modal-fondo" onClick={cerrarConExito}>

                <div
                    className="mensaje-modal exito"
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className="mensaje-icono">
                        <CheckCircle2 size={28} />
                    </div>

                    <h2>Cliente eliminado</h2>
                    <p>
                        "{cliente.Nombre_Cliente}" se eliminó correctamente
                        y ya no aparecerá en la lista.
                    </p>

                    <button
                        type="button"
                        className="btn-aceptar"
                        onClick={cerrarConExito}
                    >
                        Entendido
                    </button>

                </div>

            </div>

        );

    }


    // ========================================================
    // ESTADO: ERROR
    // Usa .mensaje-modal.error, ya definido en tu CSS.
    // ========================================================

    return (

        <div className="modal-fondo" onClick={onCerrar}>

            <div
                className="mensaje-modal error"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="mensaje-icono">
                    <XCircle size={28} />
                </div>

                <h2>No se puede eliminar</h2>
                <p>{mensajeError}</p>

                <div className="confirmacion-botones">

                    <button
                        type="button"
                        className="btn-cancelar"
                        onClick={onCerrar}
                    >
                        Cerrar
                    </button>

                    <button
                        type="button"
                        className="btn-aceptar"
                        onClick={() => setEstado('confirmar')}
                    >
                        Volver a intentar
                    </button>

                </div>

            </div>

        </div>

    );
}


export default ClienteEliminarModal;