// ============================================================
// MODAL PARA ELIMINAR CLIENTE
// ============================================================

import {
    X,
    Trash2,
    AlertTriangle
} from 'lucide-react';

import { useState } from 'react';

import { eliminarCliente } from '../services/api';


function ClienteEliminarModal({
    cliente,
    onCerrar,
    onEliminado,
    onMostrarMensaje
}) {

    const [eliminando, setEliminando] = useState(false);


    if (!cliente) {
        return null;
    }


    // ========================================================
    // ELIMINAR CLIENTE
    // ========================================================

    const confirmarEliminacion = async () => {

        setEliminando(true);

        try {

            // Llamamos al servicio de la API.
            const data = await eliminarCliente(
                cliente.CustomerID
            );

            // Avisamos al componente padre.
            await onEliminado(data);

        } catch (error) {

            console.error(error);

            if (onMostrarMensaje) {

                onMostrarMensaje({
                    tipo: 'error',
                    titulo: 'No se puede eliminar el cliente',
                    mensaje: error.message
                });

            }

        } finally {

            setEliminando(false);

        }
    };


    return (

        <div
            className="modal-fondo"
            onClick={onCerrar}
        >

            <div
                className="modal-contenido modal-confirmacion"
                onClick={(e) => e.stopPropagation()}
            >

                {/* ==================================================
                    ENCABEZADO
                ================================================== */}

                <header className="cd-encabezado">

                    <div className="cd-avatar cd-avatar-peligro">

                        <Trash2 size={25} />

                    </div>


                    <div className="cd-titulo">

                        <h2>Eliminar cliente</h2>

                        <p className="cd-subtitulo">
                            Confirme la eliminación del cliente seleccionado.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="modal-cerrar"
                        onClick={onCerrar}
                        aria-label="Cerrar"
                    >

                        <X size={22} />

                    </button>

                </header>


                {/* ==================================================
                    ADVERTENCIA
                ================================================== */}

                <div className="cd-panel cd-panel-advertencia">

                    <div className="confirmacion-icono">

                        <AlertTriangle size={32} />

                    </div>


                    <div>

                        <h3>
                            ¿Está seguro de eliminar este cliente?
                        </h3>

                        <p>
                            Esta acción intentará eliminar el registro
                            de forma permanente.
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    DATOS DEL CLIENTE
                ================================================== */}

                <div className="cd-panel">

                    <h3 className="cd-panel-titulo">

                        <span className="cd-ico azul">
                            👤
                        </span>

                        Cliente seleccionado

                    </h3>


                    <dl className="cd-datos">

                        <dt>ID del cliente</dt>

                        <dd>
                            {cliente.CustomerID}
                        </dd>


                        <dt>Nombre</dt>

                        <dd>
                            {cliente.Nombre_Cliente || '-'}
                        </dd>


                        <dt>Categoría</dt>

                        <dd>
                            {cliente.Categoria_Cliente || '-'}
                        </dd>


                        <dt>Método de entrega</dt>

                        <dd>
                            {cliente.Metodo_Entrega || '-'}
                        </dd>

                    </dl>

                </div>


                {/* ==================================================
                    NOTA
                ================================================== */}

                <div className="cd-nota-eliminacion">

                    <AlertTriangle size={18} />

                    <span>
                        Si el cliente tiene registros relacionados,
                        como órdenes, facturas o transacciones,
                        SQL Server puede impedir la eliminación.
                    </span>

                </div>


                {/* ==================================================
                    BOTONES
                ================================================== */}

                <div className="modal-footer">

                    <button
                        type="button"
                        className="btn btn-claro"
                        onClick={onCerrar}
                        disabled={eliminando}
                    >
                        Cancelar
                    </button>


                    <button
                        type="button"
                        className="btn btn-rojo"
                        onClick={confirmarEliminacion}
                        disabled={eliminando}
                    >

                        <Trash2 size={17} />

                        {eliminando
                            ? 'Eliminando...'
                            : 'Eliminar cliente'
                        }

                    </button>

                </div>

            </div>

        </div>
    );
}


export default ClienteEliminarModal;