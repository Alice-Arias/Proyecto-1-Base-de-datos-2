// ============================================================
// MODAL PARA EDITAR UN CLIENTE
// ============================================================

// Iconos de Lucide.
import {
    X,
    Pencil,
    User,
    Tag,
    Users,
    Phone,
    MapPin,
    Save,
    Loader2
} from 'lucide-react';

// Hooks de React.
import { useEffect, useState } from 'react';

// Función de la API para actualizar.
import { actualizarCliente } from '../services/api';


function ClienteEditarModal({
    cliente,
    onCerrar,
    onClienteActualizado,
    onMostrarMensaje
}) {

    // ========================================================
    // FORMULARIO
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


    const [guardando, setGuardando] = useState(false);


    // ========================================================
    // CARGAR DATOS DEL CLIENTE
    // ========================================================

    useEffect(() => {

        if (!cliente) {
            return;
        }

        setFormulario({

            Nombre: cliente.Nombre_Cliente ?? '',

            CategoriaID:
                cliente.Categoria_ID ?? '',

            GrupoCompraID:
                cliente.Grupo_Compra_ID ?? '',

            ContactoPrimarioID:
                cliente.Contacto_Primario_ID ?? '',

            ContactoAlternativoID:
                cliente.Contacto_Alternativo_ID ?? '',

            ClienteFacturarID:
                cliente.Cliente_Por_Facturar_ID ?? '',

            MetodoEntregaID:
                cliente.Metodo_Entrega_ID ?? '',

            CiudadEntregaID:
                cliente.Ciudad_Entrega_ID ?? '',

            LimiteCredito:
                cliente.Limite_Credito ?? '',

            Descuento:
                cliente.Descuento ?? '0',

            DiasGracia:
                cliente.Dias_De_Gracia ?? '7',

            Telefono:
                cliente.Telefono ?? '',

            Fax:
                cliente.Fax ?? '',

            SitioWeb:
                cliente.Sitio_Web ?? '',

            DireccionEntrega1:
                cliente.Direccion_Entrega1 ?? '',

            DireccionEntrega2:
                cliente.Direccion_Entrega2 ?? '',

            CodigoPostal:
                cliente.Codigo_Postal ?? '',

            DireccionPostal1:
                cliente.Direccion_Postal1 ?? '',

            DireccionPostal2:
                cliente.Direccion_Postal2 ?? '',

            UsuarioID: 1

        });

    }, [cliente]);


    // ========================================================
    // CAMBIAR CAMPO
    // ========================================================

    const cambiarCampo = (e) => {

        const { name, value } = e.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));

    };


    // ========================================================
    // ACTUALIZAR CLIENTE
    // ========================================================

    const guardarCambios = async (e) => {

        e.preventDefault();

        setGuardando(true);

        try {

            // Convertimos los campos numéricos.
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


            // Llamamos al servicio de actualización.
            const data = await actualizarCliente(
                cliente.CustomerID,
                datos
            );


            // Avisamos al componente padre.
            await onClienteActualizado(data);


        } catch (error) {

            console.error(error);

            if (onMostrarMensaje) {

                onMostrarMensaje({

                    tipo: 'error',

                    titulo: 'No se puede actualizar el cliente',

                    mensaje: error.message

                });

            }

        } finally {

            setGuardando(false);

        }

    };


    // Si no existe cliente, no mostramos nada.
    if (!cliente) {
        return null;
    }


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

                        <Pencil size={25} />

                    </div>


                    <div className="cd-titulo">

                        <h2>Modificar cliente</h2>

                        <p className="cd-subtitulo">

                            Actualice la información del cliente
                            seleccionado.

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
                    IDENTIFICACIÓN
                ================================================== */}

                <div className="cd-panel">

                    <h3 className="cd-panel-titulo">

                        <span className="cd-ico azul">
                            <User size={18} />
                        </span>

                        Información principal

                    </h3>


                    <div className="form-grid">

                        <div className="campo">

                            <label>
                                ID del cliente
                            </label>

                            <input
                                type="text"
                                value={cliente.CustomerID}
                                disabled
                            />

                        </div>


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
                        onClick={guardarCambios}
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

                                Guardar cambios
                            </>

                        )}

                    </button>

                </div>

            </div>

        </div>
    );
}


export default ClienteEditarModal;