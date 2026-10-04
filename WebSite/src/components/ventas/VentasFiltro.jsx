import { useState, useRef } from 'react';
import { Search, RotateCcw, Calendar, Plus } from 'lucide-react';

import './ventas.css';


// Este componente permite:
// 1. Escribir un número de factura.
// 2. Escribir el nombre de un cliente (texto libre, parcial).
// 3. Elegir un método de entrega.
// 4. Elegir un rango de fechas (desde / hasta).
// 5. Elegir un rango de monto (desde / hasta).
// 6. Buscar ventas con esos filtros (acumulativos entre sí).
// 7. Restaurar todos los filtros.
//
// Recibe desde el componente padre:
// metodosEntrega: lista de métodos de entrega para el select.
// onBuscar:       se ejecuta al presionar "Buscar", recibe
//                 un objeto con todos los filtros.
// onRestaurar:    se ejecuta al presionar "Restaurar filtros".

function VentasFiltro({ metodosEntrega = [], onBuscar, onRestaurar, onNuevo }) {

    const [numeroFactura, setNumeroFactura] = useState('');
    const [cliente, setCliente] = useState('');
    const [metodoEntrega, setMetodoEntrega] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [montoInicio, setMontoInicio] = useState('');
    const [montoFin, setMontoFin] = useState('');

    // Referencias para forzar la apertura del calendario nativo
    // al hacer click en cualquier parte del campo, no solo en
    // el pequeño ícono que dibuja el navegador.
    const refFechaInicio = useRef(null);
    const refFechaFin = useRef(null);

    const abrirCalendario = (ref) => {
        if (ref.current?.showPicker) {
            ref.current.showPicker();
        } else {
            ref.current?.focus();
        }
    };


    // buscar
    // Toma todos los filtros y los envía al componente padre.

    const buscar = () => {
        onBuscar({
            numeroFactura,
            cliente,
            metodoEntrega,
            fechaInicio,
            fechaFin,
            montoInicio,
            montoFin
        });
    };


    // restaurar
    // 1. Limpia todos los campos.
    // 2. Avisa al padre que debe restaurar los resultados.

    const restaurar = () => {
        setNumeroFactura('');
        setCliente('');
        setMetodoEntrega('');
        setFechaInicio('');
        setFechaFin('');
        setMontoInicio('');
        setMontoFin('');

        onRestaurar();
    };


    const porEnter = (e) => {
        if (e.key === 'Enter') {
            buscar();
        }
    };


    return (

        <div className="vf-filtro">

            <div className="vf-campo vf-factura">
                <input
                    type="number"
                    placeholder="N.° de factura"
                    value={numeroFactura}
                    onChange={(e) => setNumeroFactura(e.target.value)}
                    onKeyDown={porEnter}
                />
            </div>

            <div className="vf-campo vf-cliente">
                <input
                    type="text"
                    placeholder="Buscar por cliente..."
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    onKeyDown={porEnter}
                />
            </div>

            <div className="vf-campo vf-metodo">
                <select
                    value={metodoEntrega}
                    onChange={(e) => setMetodoEntrega(e.target.value)}
                >
                    <option value="">Todos los métodos</option>
                    {metodosEntrega.map((m) => (
                        <option key={m.ID} value={m.Nombre}>
                            {m.Nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="vf-campo vf-fecha">
                <div
                    className="vf-fecha-wrap"
                    onClick={() => abrirCalendario(refFechaInicio)}
                    title="Fecha desde"
                >
                    <Calendar size={15} className="vf-fecha-ico" />
                    <input
                        ref={refFechaInicio}
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </div>
            </div>

            <div className="vf-campo vf-fecha">
                <div
                    className="vf-fecha-wrap"
                    onClick={() => abrirCalendario(refFechaFin)}
                    title="Fecha hasta"
                >
                    <Calendar size={15} className="vf-fecha-ico" />
                    <input
                        ref={refFechaFin}
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </div>
            </div>

            <div className="vf-campo vf-monto">
                <input
                    type="number"
                    placeholder="Monto desde"
                    value={montoInicio}
                    onChange={(e) => setMontoInicio(e.target.value)}
                    onKeyDown={porEnter}
                />
            </div>

            <div className="vf-campo vf-monto">
                <input
                    type="number"
                    placeholder="Monto hasta"
                    value={montoFin}
                    onChange={(e) => setMontoFin(e.target.value)}
                    onKeyDown={porEnter}
                />
            </div>

            <div className="vf-acciones">

                <button className="btn-buscar" onClick={buscar}>
                    <Search size={16} />
                    Buscar
                </button>

                <button className="btn-restaurar" onClick={restaurar}>
                    <RotateCcw size={16} />
                    Restaurar filtros
                </button>

                {onNuevo && (
                    <button className="vf-btn-nuevo" onClick={onNuevo}>
                        <Plus size={16} />
                        Nueva venta
                    </button>
                )}

            </div>

        </div>
    );
}

export default VentasFiltro;