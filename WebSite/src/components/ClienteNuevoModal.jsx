
// ============================================================
// MODAL PARA CREAR UN NUEVO CLIENTE
// ============================================================


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


import { useEffect, useState } from 'react';


import {
    insertarCliente,
    obtenerOpcionesClientes
} from '../services/api';

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

    // ========================================================
    // OPCIONES QUE VIENEN DE LA BASE DE DATOS
    // ========================================================

    const [opciones, setOpciones] = useState({
        categorias: [],
        gruposCompra: [],
        contactos: [],
        clientes: [],
        metodosEntrega: [],
        ciudades: []
    });

    // Indica si las opciones todavía están cargando.
    const [cargandoOpciones, setCargandoOpciones] = useState(true);

    // Indica si se está guardando el cliente.
    const [guardando, setGuardando] = useState(false);

    // ========================================================
    // CARGAR OPCIONES DESDE LA BASE DE DATOS
    // ========================================================

    useEffect(() => {

        const cargarOpciones = async () => {

            try {

                setCargandoOpciones(true);

                const data = await obtenerOpcionesClientes();

                setOpciones({
                    categorias: data.categorias || [],
                    gruposCompra: data.gruposCompra || [],
                    contactos: data.contactos || [],
                    clientes: data.clientes || [],
                    metodosEntrega: data.metodosEntrega || [],
                    ciudades: data.ciudades || []
                });

            } catch (error) {

                console.error(error);

                if (onMostrarMensaje) {

                    onMostrarMensaje({
                        tipo: 'error',
                        titulo: 'No se pudieron cargar las opciones',
                        mensaje: error.message
                    });

                }

            } finally {

                setCargandoOpciones(false);

            }
        };

        cargarOpciones();

    }, [onMostrarMensaje]);

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

            // ==================================================
            // CONVERTIR LOS CAMPOS NUMÉRICOS
            // ==================================================

            const datos = {

                ...formulario,

                CategoriaID:
                    Number(formulario.CategoriaID),

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

            // ==================================================
            // ENVIAR CLIENTE A LA API
            // ==================================================

            const data = await insertarCliente(datos);

            // Avisamos al componente padre.
            await onClienteCreado(data);

        } catch (error) {

            console.error(error);

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

    // ========================================================
    // RENDERIZADO
    // ========================================================

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

                        <h2>
                            Nuevo cliente
                        </h2>

                        <p className="cd-subtitulo">
                            Complete la información para registrar
                            un nuevo cliente.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="modal-cerrar"
                        onClick={onCerrar}
                        aria-label="Cerrar"
                        disabled={guardando}
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
                                    maxLength={100}
                                    placeholder="Nombre del cliente"
                                />

                            </div>

                            {/* Categoría */}

                            <div className="campo">

                                <label>

                                    <Tag size={14} />

                                    Categoría

                                </label>

                                <select
                                    name="CategoriaID"
                                    value={formulario.CategoriaID}
                                    onChange={cambiarCampo}
                                    required
                                    disabled={cargandoOpciones}
                                >

                                    <option value="">

                                        {cargandoOpciones
                                            ? 'Cargando categorías...'
                                            : 'Seleccione una categoría'}

                                    </option>

                                    {opciones.categorias.map(
                                        (categoria) => (

                                            <option
                                                key={categoria.ID}
                                                value={categoria.ID}
                                            >
                                                {categoria.Nombre}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* Grupo de compra */}

                            <div className="campo">

                                <label>

                                    <Users size={14} />

                                    Grupo de compra

                                </label>

                                <select
                                    name="GrupoCompraID"
                                    value={formulario.GrupoCompraID}
                                    onChange={cambiarCampo}
                                    disabled={cargandoOpciones}
                                >

                                    <option value="">
                                        Sin grupo de compra
                                    </option>

                                    {opciones.gruposCompra.map(
                                        (grupo) => (

                                            <option
                                                key={grupo.ID}
                                                value={grupo.ID}
                                            >
                                                {grupo.Nombre}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* Contacto principal */}

                            <div className="campo">

                                <label>
                                    Contacto principal
                                </label>

                                <select
                                    name="ContactoPrimarioID"
                                    value={formulario.ContactoPrimarioID}
                                    onChange={cambiarCampo}
                                    required
                                    disabled={cargandoOpciones}
                                >

                                    <option value="">

                                        {cargandoOpciones
                                            ? 'Cargando contactos...'
                                            : 'Seleccione un contacto'}

                                    </option>

                                    {opciones.contactos.map(
                                        (contacto) => (

                                            <option
                                                key={contacto.ID}
                                                value={contacto.ID}
                                            >
                                                {contacto.Nombre}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* Contacto alternativo */}

                            <div className="campo">

                                <label>
                                    Contacto alternativo
                                </label>

                                <select
                                    name="ContactoAlternativoID"
                                    value={formulario.ContactoAlternativoID}
                                    onChange={cambiarCampo}
                                    disabled={cargandoOpciones}
                                >

                                    <option value="">
                                        Sin contacto alternativo
                                    </option>

                                    {opciones.contactos.map(
                                        (contacto) => (

                                            <option
                                                key={contacto.ID}
                                                value={contacto.ID}
                                            >
                                                {contacto.Nombre}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* Cliente por facturar */}

                            <div className="campo">

                                <label>
                                    Cliente por facturar
                                </label>

                                <select
                                    name="ClienteFacturarID"
                                    value={formulario.ClienteFacturarID}
                                    onChange={cambiarCampo}
                                    disabled={cargandoOpciones}
                                >

                                    <option value="">
                                        El mismo cliente
                                    </option>

                                    {opciones.clientes.map(
                                        (cliente) => (

                                            <option
                                                key={cliente.ID}
                                                value={cliente.ID}
                                            >
                                                {cliente.Nombre}
                                            </option>

                                        )
                                    )}

                                </select>

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

                            {/* Método de entrega */}

                            <div className="campo">

                                <label>
                                    Método de entrega
                                </label>

                                <select
                                    name="MetodoEntregaID"
                                    value={formulario.MetodoEntregaID}
                                    onChange={cambiarCampo}
                                    required
                                    disabled={cargandoOpciones}
                                >

                                    <option value="">

                                        {cargandoOpciones
                                            ? 'Cargando métodos...'
                                            : 'Seleccione un método'}

                                    </option>

                                    {opciones.metodosEntrega.map(
                                        (metodo) => (

                                            <option
                                                key={metodo.ID}
                                                value={metodo.ID}
                                            >
                                                {metodo.Nombre}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* Ciudad */}

                            <div className="campo">

                                <label>
                                    Ciudad de entrega
                                </label>

                                <select
                                    name="CiudadEntregaID"
                                    value={formulario.CiudadEntregaID}
                                    onChange={cambiarCampo}
                                    required
                                    disabled={cargandoOpciones}
                                >

                                    <option value="">

                                        {cargandoOpciones
                                            ? 'Cargando ciudades...'
                                            : 'Seleccione una ciudad'}

                                    </option>

                                    {opciones.ciudades.map(
                                        (ciudad) => (

                                            <option
                                                key={ciudad.ID}
                                                value={ciudad.ID}
                                            >
                                                {ciudad.Nombre}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* Teléfono */}

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
                                    maxLength={20}
                                    placeholder="Teléfono"
                                />

                            </div>

                            {/* Fax */}

                            <div className="campo">

                                <label>
                                    Fax
                                </label>

                                <input
                                    type="text"
                                    name="Fax"
                                    value={formulario.Fax}
                                    onChange={cambiarCampo}
                                    maxLength={20}
                                    placeholder="Fax"
                                />

                            </div>

                            {/* Sitio web */}

                            <div className="campo campo-completo">

                                <label>
                                    Sitio web
                                </label>

                                <input
                                    type="url"
                                    name="SitioWeb"
                                    value={formulario.SitioWeb}
                                    onChange={cambiarCampo}
                                    maxLength={256}
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

                            {/* Límite de crédito */}

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
                                    placeholder="0.00"
                                />

                            </div>

                            {/* Descuento */}

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

                            {/* Días de gracia */}

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

                            {/* Dirección de entrega */}

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
                                    maxLength={60}
                                    placeholder="Dirección principal"
                                />

                            </div>

                            {/* Dirección de entrega adicional */}

                            <div className="campo campo-completo">

                                <label>
                                    Dirección de entrega adicional
                                </label>

                                <input
                                    type="text"
                                    name="DireccionEntrega2"
                                    value={formulario.DireccionEntrega2}
                                    onChange={cambiarCampo}
                                    maxLength={60}
                                    placeholder="Información adicional"
                                />

                            </div>

                            {/* Código postal */}

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
                                    maxLength={10}
                                    placeholder="Código postal"
                                />

                            </div>

                            {/* Dirección postal */}

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
                                    maxLength={60}
                                    placeholder="Dirección postal"
                                />

                            </div>

                            {/* Dirección postal adicional */}

                            <div className="campo campo-completo">

                                <label>
                                    Dirección postal adicional
                                </label>

                                <input
                                    type="text"
                                    name="DireccionPostal2"
                                    value={formulario.DireccionPostal2}
                                    onChange={cambiarCampo}
                                    maxLength={60}
                                    placeholder="Información adicional"
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
                            disabled={
                                guardando ||
                                cargandoOpciones
                            }
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
