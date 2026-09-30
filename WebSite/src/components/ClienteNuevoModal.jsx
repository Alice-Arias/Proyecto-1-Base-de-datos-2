// ============================================================
// MODAL PARA CREAR UN NUEVO CLIENTE
// ============================================================

// Iconos utilizados en el formulario.
import {
    X,
    UserPlus,
    User,
    Tag,
    Users,
    Phone,
    MapPin,
    Save,
    Loader2
} from 'lucide-react';

// Hook para manejar el formulario.
import { useState } from 'react';

// Función de la API para insertar el cliente.
import { insertarCliente } from '../services/api';


function ClienteNuevoModal({
    onCerrar,
    onClienteCreado,
    onMostrarMensaje
}) {

    // ========================================================
    // DATOS DEL FORMULARIO
    // ========================================================

    const [formulario, setFormulario] = useState({

        Nombre: '',
        CategoriaID: '',
        GrupoCompraID: '',
        ContactoPrimarioID: '',
        ContactoAlternativoID: '',
        ClienteFacturarID: '',
        MetodoEntregaID: '',
        CiudadEntregaID: '',

        LimiteCredito: '',
        Descuento: '0',
        DiasGracia: '7',

        Telefono: '',
        Fax: '',
        SitioWeb: '',

        DireccionEntrega1: '',
        DireccionEntrega2: '',

        CodigoPostal: '',

        DireccionPostal1: '',
        DireccionPostal2: '',

        UsuarioID: 1
    });


    // Indica si se está guardando.
    const [guardando, setGuardando] = useState(false);


    // ========================================================
    // CAMBIAR VALOR DE UN CAMPO
    // ========================================================

    const cambiarCampo = (e) => {

        const { name, value } = e.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));
    };


    // ========================================================
    // GUARDAR CLIENTE
    // ========================================================

    const guardarCliente = async (e) => {

        e.preventDefault();

        setGuardando(true);

        try {

            // Convertimos los campos numéricos.
            const datos = {
                ...formulario,

                CategoriaID: Number(formulario.CategoriaID),

                GrupoCompraID:
                    formulario.GrupoCompraID === ''
                        ? null
                        : Number(formulario.GrupoCompraID),

                ContactoPrimarioID:
                    Number(formulario.ContactoPrimarioID),

                ContactoAlternativoID:
                    formulario.ContactoAlternativoID === ''
                        ? null
                        : Number(formulario.ContactoAlternativoID),

                ClienteFacturarID:
                    formulario.ClienteFacturarID === ''
                        ? null
                        : Number(formulario.ClienteFacturarID),

                MetodoEntregaID:
                    Number(formulario.MetodoEntregaID),

                CiudadEntregaID:
                    Number(formulario.CiudadEntregaID),

                LimiteCredito:
                    formulario.LimiteCredito === ''
                        ? null
                        : Number(formulario.LimiteCredito),

                Descuento:
                    Number(formulario.Descuento),

                DiasGracia:
                    Number(formulario.DiasGracia)
            };


            // Llamamos al servicio de la API.
            const data = await insertarCliente(datos);


            // Avisamos al componente padre.
            await onClienteCreado(data);


        } catch (error) {

            console.error(error);

            // Mostramos el error en el modal de mensajes.
            if (onMostrarMensaje) {

                onMostrarMensaje({
                    tipo: 'error',
                    titulo: 'No se puede crear el cliente',
                    mensaje: error.message
                });

            }

        } finally {

            setGuardando(false);

        }
    };


    return (

        <div
            className="modal-fondo"
            onClick={onCerrar}
        >

            <div
                className="modal-contenido modal-cliente-form"
                onClick={(e) => e.stopPropagation()}
            >

                {/* ==================================================
                    ENCABEZADO
                ================================================== */}

                <header className="cd-encabezado">

                    <div className="cd-avatar">
                        <UserPlus size={25} />
                    </div>

                    <div className="cd-titulo">

                        <h2>Nuevo cliente</h2>

                        <p className="cd-subtitulo">
                            Complete la información para registrar un nuevo cliente.
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
                    FORMULARIO
                ================================================== */}

                <form onSubmit={guardarCliente}>

                    {/* ==================================================
                        INFORMACIÓN PRINCIPAL
                    ================================================== */}

                    <div className="cd-panel">

                        <h3 className="cd-panel-titulo">

                            <span className="cd-ico azul">
                                <User size={18} />
                            </span>

                            Información principal

                        </h3>


                        <div className="form-grid">

                            {/* Nombre */}

                            <div className="campo">

                                <label>
                                    Nombre del cliente
                                </label>

                                <input
                                    type="text"
                                    name="Nombre"
                                    value={formulario.Nombre}
                                    onChange={cambiarCampo}
                                    required
                                />

                            </div>


                            {/* Categoría */}

                            <div className="campo">

                                <label>
                                    <Tag size={14} />
                                    Categoría
                                </label>

                                <input
                                    type="number"
                                    name="CategoriaID"
                                    value={formulario.CategoriaID}
                                    onChange={cambiarCampo}
                                    required
                                />

                            </div>


                            {/* Grupo de compra */}

                            <div className="campo">

                                <label>
                                    <Users size={14} />
                                    Grupo de compra
                                </label>

                                <input
                                    type="number"
                                    name="GrupoCompraID"
                                    value={formulario.GrupoCompraID}
                                    onChange={cambiarCampo}
                                />

                            </div>


                            {/* Contacto principal */}

                            <div className="campo">

                                <label>
                                    Contacto principal
                                </label>

                                <input
                                    type="number"
                                    name="ContactoPrimarioID"
                                    value={formulario.ContactoPrimarioID}
                                    onChange={cambiarCampo}
                                    required
                                />

                            </div>


                            {/* Contacto alternativo */}

                            <div className="campo">

                                <label>
                                    Contacto alternativo
                                </label>

                                <input
                                    type="number"
                                    name="ContactoAlternativoID"
                                    value={formulario.ContactoAlternativoID}
                                    onChange={cambiarCampo}
                                />

                            </div>


                            {/* Cliente por facturar */}

                            <div className="campo">

                                <label>
                                    Cliente por facturar
                                </label>

                                <input
                                    type="number"
                                    name="ClienteFacturarID"
                                    value={formulario.ClienteFacturarID}
                                    onChange={cambiarCampo}
                                />

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        ENTREGA Y CONTACTO
                    ================================================== */}

                    <div className="cd-panel">

                        <h3 className="cd-panel-titulo">

                            <span className="cd-ico verde">
                                <Phone size={18} />
                            </span>

                            Entrega y contacto

                        </h3>


                        <div className="form-grid">

                            <div className="campo">

                                <label>
                                    Método de entrega
                                </label>

                                <input
                                    type="number"
                                    name="MetodoEntregaID"
                                    value={formulario.MetodoEntregaID}
                                    onChange={cambiarCampo}
                                    required
                                />

                            </div>


                            <div className="campo">

                                <label>
                                    Ciudad de entrega
                                </label>

                                <input
                                    type="number"
                                    name="CiudadEntregaID"
                                    value={formulario.CiudadEntregaID}
                                    onChange={cambiarCampo}
                                    required
                                />

                            </div>


                            <div className="campo">

                                <label>
                                    <Phone size={14} />
                                    Teléfono
                                </label>

                                <input
                                    type="text"
                                    name="Telefono"
                                    value={formulario.Telefono}
                                    onChange={cambiarCampo}
                                    required
                                />

                            </div>


                            <div className="campo">

                                <label>
                                    Fax
                                </label>

                                <input
                                    type="text"
                                    name="Fax"
                                    value={formulario.Fax}
                                    onChange={cambiarCampo}
                                />

                            </div>


                            <div className="campo campo-completo">

                                <label>
                                    Sitio web
                                </label>

                                <input
                                    type="url"
                                    name="SitioWeb"
                                    value={formulario.SitioWeb}
                                    onChange={cambiarCampo}
                                    placeholder="https://..."
                                />

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        INFORMACIÓN DE PAGO
                    ================================================== */}

                    <div className="cd-panel">

                        <h3 className="cd-panel-titulo">

                            <span className="cd-ico ambar">
                                📄
                            </span>

                            Información de pago

                        </h3>


                        <div className="form-grid">

                            <div className="campo">

                                <label>
                                    Límite de crédito
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="LimiteCredito"
                                    value={formulario.LimiteCredito}
                                    onChange={cambiarCampo}
                                />

                            </div>


                            <div className="campo">

                                <label>
                                    Descuento (%)
                                </label>

                                <input
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    max="100"
                                    name="Descuento"
                                    value={formulario.Descuento}
                                    onChange={cambiarCampo}
                                />

                            </div>


                            <div className="campo">

                                <label>
                                    Días de gracia
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="365"
                                    name="DiasGracia"
                                    value={formulario.DiasGracia}
                                    onChange={cambiarCampo}
                                />

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        DIRECCIONES
                    ================================================== */}

                    <div className="cd-panel">

                        <h3 className="cd-panel-titulo">

                            <span className="cd-ico azul">
                                <MapPin size={18} />
                            </span>

                            Direcciones

                        </h3>


                        <div className="form-grid">

                            <div className="campo campo-completo">

                                <label>
                                    Dirección de entrega
                                </label>

                                <input
                                    type="text"
                                    name="DireccionEntrega1"
                                    value={formulario.DireccionEntrega1}
                                    onChange={cambiarCampo}
                                    required
                                />

                            </div>


                            <div className="campo campo-completo">

                                <label>
                                    Dirección de entrega adicional
                                </label>

                                <input
                                    type="text"
                                    name="DireccionEntrega2"
                                    value={formulario.DireccionEntrega2}
                                    onChange={cambiarCampo}
                                />

                            </div>


                            <div className="campo">

                                <label>
                                    Código postal
                                </label>

                                <input
                                    type="text"
                                    name="CodigoPostal"
                                    value={formulario.CodigoPostal}
                                    onChange={cambiarCampo}
                                    required
                                />

                            </div>


                            <div className="campo">

                                <label>
                                    Dirección postal
                                </label>

                                <input
                                    type="text"
                                    name="DireccionPostal1"
                                    value={formulario.DireccionPostal1}
                                    onChange={cambiarCampo}
                                    required
                                />

                            </div>


                            <div className="campo campo-completo">

                                <label>
                                    Dirección postal adicional
                                </label>

                                <input
                                    type="text"
                                    name="DireccionPostal2"
                                    value={formulario.DireccionPostal2}
                                    onChange={cambiarCampo}
                                />

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        BOTONES
                    ================================================== */}

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="btn btn-claro"
                            onClick={onCerrar}
                            disabled={guardando}
                        >
                            Cancelar
                        </button>


                        <button
                            type="submit"
                            className="btn btn-azul"
                            disabled={guardando}
                        >

                            {guardando ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="girando"
                                    />

                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save size={17} />

                                    Crear cliente
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default ClienteNuevoModal;