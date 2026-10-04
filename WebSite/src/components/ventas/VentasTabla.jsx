// ============================================================
// TABLA DE VENTAS
// ============================================================
//
// Props:
//   ventas    : lista de ventas a mostrar (ya paginada/ordenada
//               por el componente padre)
//   onVerUna  : recibe el InvoiceID al hacer click en una fila
//               o en el botón de ver
// ============================================================

import { Eye } from 'lucide-react';

import './ventas.css';


function VentasTabla({ ventas, onVerUna }) {

    const formatearFecha = (fecha) => {

        if (!fecha) {
            return '-';
        }

        const d = new Date(fecha);

        return d.toLocaleDateString('es-CR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatearMonto = (monto) => {

        if (monto === null || monto === undefined) {
            return '-';
        }

        return Number(monto).toLocaleString('es-CR', {
            style: 'currency',
            currency: 'USD'
        });
    };


    return (

        <div className="vta-tabla-contenedor">

            <table className="vta-tabla">

                <thead>
                    <tr>
                        <th>N.° Factura</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Método de entrega</th>
                        <th className="vta-centro">Monto</th>
                        <th className="vta-centro">Ver</th>
                    </tr>
                </thead>

                <tbody>

                    {ventas.length === 0 && (

                        <tr>
                            <td colSpan={6} className="vta-vacio">
                                No se encontraron ventas con esos filtros.
                            </td>
                        </tr>

                    )}

                    {ventas.map((v) => (

                        <tr
                            key={v.InvoiceID}
                            onClick={() => onVerUna(v.InvoiceID)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>
                                <span className="vta-numero-factura">
                                    #{v.InvoiceID}
                                </span>
                            </td>
                            <td>{formatearFecha(v.Fecha_Factura)}</td>
                            <td>
                                <span className="vta-nombre-cliente">
                                    {v.Nombre_Cliente}
                                </span>
                            </td>
                            <td>{v.Metodo_Entrega}</td>
                            <td className="vta-centro">
                                <span className="vta-monto">
                                    {formatearMonto(v.Monto)}
                                </span>
                            </td>
                            <td className="vta-centro">
                                <button
                                    type="button"
                                    className="vta-accion vta-accion-ver"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onVerUna(v.InvoiceID);
                                    }}
                                    title="Ver detalle"
                                    aria-label="Ver detalle"
                                >
                                    <Eye size={17} />
                                </button>
                            </td>
                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}


export default VentasTabla;