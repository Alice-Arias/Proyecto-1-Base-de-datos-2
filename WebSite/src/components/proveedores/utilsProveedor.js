

// ------------------------------------------------------------
// VALORES INICIALES
// ------------------------------------------------------------

export const FORMULARIO_VACIO = {
    Nombre: '',
    ReferenciaProveedor: '',
    CategoriaID: '',
    ContactoPrimarioID: '',
    ContactoAlternativoID: '',
    MetodoEntregaID: '',
    CiudadEntregaID: '',
    CiudadPostalID: '',
    Telefono: '',
    Fax: '',
    SitioWeb: '',
    NombreCuentaBancaria: '',
    SucursalBancaria: '',
    CodigoBanco: '',
    NumeroCuentaBancaria: '',
    CodigoInternacionalBanco: '',
    DiasPago: '7',
    ComentariosInternos: '',
    DireccionEntrega1: '',
    DireccionEntrega2: '',
    CodigoPostalEntrega: '',
    DireccionPostal1: '',
    DireccionPostal2: '',
    CodigoPostalPostal: '',
    UsuarioID: 1
};


// ------------------------------------------------------------
// DETALLE (SP_Proveedores_Detalle) → FORMULARIO
//
// Los select trabajan con texto, por eso los IDs se convierten
// a String. Los valores null pasan a '' para los inputs.
// ------------------------------------------------------------

export function formularioDesdeDetalle(d) {

    const texto = (valor) => valor ?? '';

    const id = (valor) =>
        valor != null ? String(valor) : '';

    return {
        Nombre: texto(d.Nombre_Proveedor),
        ReferenciaProveedor: texto(d.Referencia_Proveedor),

        CategoriaID: id(d.Categoria_ID),
        ContactoPrimarioID: id(d.Contacto_Primario_ID),
        ContactoAlternativoID: id(d.Contacto_Alternativo_ID),
        MetodoEntregaID: id(d.Metodo_Entrega_ID),
        CiudadEntregaID: id(d.Ciudad_Entrega_ID),

        // Estos dos campos solo llegan si SP_Proveedores_Detalle
        // devuelve PostalCityID y PostalPostalCode.
        CiudadPostalID: id(d.Ciudad_Postal_ID ?? d.Ciudad_Entrega_ID),
        CodigoPostalPostal: texto(d.Codigo_Postal_Postal),

        Telefono: texto(d.Telefono),
        Fax: texto(d.Fax),
        SitioWeb: texto(d.Sitio_Web),

        NombreCuentaBancaria: texto(d.Nombre_Cuenta_Bancaria),
        SucursalBancaria: texto(d.Sucursal_Cuenta_Bancaria),
        CodigoBanco: texto(d.Codigo_Cuenta_Bancaria),
        NumeroCuentaBancaria: texto(d.Numero_Cuenta_Bancaria),
        CodigoInternacionalBanco: texto(d.Codigo_Bancario_Internacional),

        DiasPago:
            d.Dias_De_Gracia != null
                ? String(d.Dias_De_Gracia)
                : '7',

        ComentariosInternos: texto(d.Comentarios_Internos),

        DireccionEntrega1: texto(d.Direccion_Entrega1),
        DireccionEntrega2: texto(d.Direccion_Entrega2),
        CodigoPostalEntrega: texto(d.Codigo_Postal_Entrega),

        DireccionPostal1: texto(d.Direccion_Postal1),
        DireccionPostal2: texto(d.Direccion_Postal2),

        UsuarioID: 1
    };
}


// ------------------------------------------------------------
// VALIDACIÓN
//
// Devuelve el PRIMER mensaje de error que encuentre,
// o null si todo está bien.
// Los límites coinciden con los tamaños de los parámetros
// de los procedimientos almacenados.
// ------------------------------------------------------------

export function validarProveedor(f) {

    const t = (valor) => String(valor ?? '').trim();

    const dias = Number(f.DiasPago);

    const reglas = [

        // ---------- Información principal ----------

        !t(f.Nombre) &&
            'Debe ingresar el nombre del proveedor.',

        t(f.Nombre).length > 100 &&
            'El nombre del proveedor no puede superar los 100 caracteres.',

        t(f.ReferenciaProveedor).length > 20 &&
            'El código del proveedor no puede superar los 20 caracteres.',

        !f.CategoriaID &&
            'Debe seleccionar una categoría.',

        !f.ContactoPrimarioID &&
            'Debe seleccionar un contacto principal.',

        // ---------- Entrega y contacto ----------

        !f.MetodoEntregaID &&
            'Debe seleccionar un método de entrega.',

        !f.CiudadEntregaID &&
            'Debe seleccionar una ciudad de entrega.',

        !t(f.Telefono) &&
            'Debe ingresar el teléfono del proveedor.',

        t(f.Telefono).length > 20 &&
            'El teléfono no puede superar los 20 caracteres.',

        t(f.Fax).length > 20 &&
            'El fax no puede superar los 20 caracteres.',

        t(f.SitioWeb) &&
        !/^https?:\/\//i.test(t(f.SitioWeb)) &&
            'El sitio web debe empezar con http:// o https://',

        // ---------- Datos bancarios y de pago ----------

        t(f.SucursalBancaria).length > 50 &&
            'El banco y sucursal no puede superar los 50 caracteres.',

        t(f.NombreCuentaBancaria).length > 50 &&
            'El titular de la cuenta no puede superar los 50 caracteres.',

        t(f.NumeroCuentaBancaria).length > 50 &&
            'El número de cuenta no puede superar los 50 caracteres.',

        t(f.CodigoBanco).length > 20 &&
            'El código del banco no puede superar los 20 caracteres.',

        t(f.CodigoInternacionalBanco).length > 20 &&
            'El código internacional no puede superar los 20 caracteres.',

        (t(f.DiasPago) === '' || !Number.isInteger(dias)) &&
            'Los días de gracia deben ser un número entero.',

        (dias < 0 || dias > 365) &&
            'Los días de gracia deben estar entre 0 y 365.',

        // ---------- Direcciones ----------

        !t(f.DireccionEntrega1) &&
            'Debe ingresar la dirección de entrega.',

        t(f.DireccionEntrega1).length > 60 &&
            'La dirección de entrega no puede superar los 60 caracteres.',

        t(f.DireccionEntrega2).length > 60 &&
            'La dirección de entrega adicional no puede superar los 60 caracteres.',

        !t(f.CodigoPostalEntrega) &&
            'Debe ingresar el código postal de entrega.',

        t(f.CodigoPostalEntrega).length > 10 &&
            'El código postal de entrega no puede superar los 10 caracteres.',

        !f.CiudadPostalID &&
            'Debe seleccionar la ciudad de la dirección postal.',

        !t(f.DireccionPostal1) &&
            'Debe ingresar la dirección postal.',

        t(f.DireccionPostal1).length > 60 &&
            'La dirección postal no puede superar los 60 caracteres.',

        t(f.DireccionPostal2).length > 60 &&
            'La dirección postal adicional no puede superar los 60 caracteres.',

        !t(f.CodigoPostalPostal) &&
            'Debe ingresar el código postal de la dirección postal.',

        t(f.CodigoPostalPostal).length > 10 &&
            'El código postal de la dirección postal no puede superar los 10 caracteres.'
    ];

    return reglas.find(Boolean) || null;
}


// ------------------------------------------------------------
// FORMULARIO → DATOS PARA LA API
//
// - Los IDs pasan a número.
// - Los campos opcionales vacíos se envían como null.
// ------------------------------------------------------------

export function armarDatos(f) {

    const t = (valor) => String(valor ?? '').trim();

    // Texto opcional: '' se convierte en null.
    const opcional = (valor) =>
        t(valor) === '' ? null : t(valor);

    // ID opcional: '' se convierte en null.
    const idOpcional = (valor) =>
        valor === '' || valor == null ? null : Number(valor);

    return {
        Nombre: t(f.Nombre),
        CategoriaID: Number(f.CategoriaID),
        ContactoPrimarioID: Number(f.ContactoPrimarioID),
        ContactoAlternativoID: idOpcional(f.ContactoAlternativoID),
        MetodoEntregaID: Number(f.MetodoEntregaID),
        CiudadEntregaID: Number(f.CiudadEntregaID),
        CiudadPostalID: Number(f.CiudadPostalID),

        ReferenciaProveedor: opcional(f.ReferenciaProveedor),
        NombreCuentaBancaria: opcional(f.NombreCuentaBancaria),
        SucursalBancaria: opcional(f.SucursalBancaria),
        CodigoBanco: opcional(f.CodigoBanco),
        NumeroCuentaBancaria: opcional(f.NumeroCuentaBancaria),
        CodigoInternacionalBanco: opcional(f.CodigoInternacionalBanco),

        DiasPago: Number(f.DiasPago),
        ComentariosInternos: opcional(f.ComentariosInternos),

        Telefono: t(f.Telefono),
        Fax: t(f.Fax),
        SitioWeb: t(f.SitioWeb),

        DireccionEntrega1: t(f.DireccionEntrega1),
        DireccionEntrega2: opcional(f.DireccionEntrega2),
        CodigoPostalEntrega: t(f.CodigoPostalEntrega),

        DireccionPostal1: t(f.DireccionPostal1),
        DireccionPostal2: opcional(f.DireccionPostal2),
        CodigoPostalPostal: t(f.CodigoPostalPostal),

        UsuarioID: f.UsuarioID ?? 1
    };
}