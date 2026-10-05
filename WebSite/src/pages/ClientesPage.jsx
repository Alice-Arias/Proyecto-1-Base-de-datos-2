
import { useEffect, useState } from 'react';


// ============================================================
// ICONOS
// ============================================================

import {
    Users,
    CheckCircle2,
    Tag,
    Search,
    Plus,
    Sun,
    Eye,
    AlertTriangle
} from 'lucide-react';


// ============================================================
// COMPONENTES
// ============================================================

import ClientesTabla from '../components/ClientesTabla';
import ClienteDetalleModal from '../components/ClienteDetalleModal';
import ClienteNuevoModal from '../components/ClienteNuevoModal';
import ClienteEditarModal from '../components/ClienteEditarModal';
import ClienteEliminarModal from '../components/ClienteEliminarModal';
import StatCard from '../components/StatCard';


// ============================================================
// FUNCIONES QUE SE COMUNICAN CON LA API
// ============================================================

import {
    listarClientes,
    obtenerDetalleClientes,
    insertarCliente,
    actualizarCliente,
    eliminarCliente
} from '../services/api';


// ============================================================
// CANTIDAD MÁXIMA DE CLIENTES POR PÁGINA
// ============================================================

const POR_PAGINA = 10;


// ============================================================
// ClientesPage
//
// Esta es la página principal de clientes.
//
// Aquí se controla:
//
// - Carga de clientes.
// - Filtros.
// - Selección de clientes.
// - Consulta de detalles.
// - Crear clientes.
// - Modificar clientes.
// - Eliminar clientes.
// - Estadísticas.
// - Paginación.
// - Estado de carga.
//
// ============================================================

function ClientesPage() {


  // ============================================================
  // CLIENTES
  // ============================================================

  // Clientes que actualmente se están mostrando.
  //
  // Puede ser la lista completa o una lista filtrada.

  const [clientes, setClientes] = useState([]);


  // Guarda todos los clientes sin filtrar.
  //
  // Se utiliza principalmente para obtener las categorías
  // y métodos de entrega disponibles.

  const [todosClientes, setTodosClientes] = useState([]);


  // ============================================================
  // FILTROS
  // ============================================================

  // Texto escrito en el filtro de nombre.

  const [nombre, setNombre] = useState('');


  // Categoría seleccionada.

  const [categoria, setCategoria] = useState('');


  // Método de entrega seleccionado.

  const [metodoEntrega, setMetodoEntrega] = useState('');


  // ============================================================
  // SELECCIÓN DE CLIENTES
  // ============================================================

  // Guarda los CustomerID de los clientes seleccionados.

  const [seleccionados, setSeleccionados] = useState([]);


  // ============================================================
  // MODAL DE DETALLE
  // ============================================================

  // Guarda los clientes que se mostrarán dentro del modal.
  //
  // null significa que el modal está cerrado.

  const [clientesModal, setClientesModal] = useState(null);


  // ============================================================
  // ESTADO DE CARGA
  // ============================================================

  // Indica si actualmente se están cargando clientes.

  const [cargando, setCargando] = useState(false);


  // ============================================================
  // PAGINACIÓN
  // ============================================================

  // Número de página actual.

  const [pagina, setPagina] = useState(1);


  // ============================================================
  // MODAL NUEVO CLIENTE
  // ============================================================

  // true  → muestra el formulario.
  // false → formulario cerrado.

  const [mostrarNuevo, setMostrarNuevo] = useState(false);


  // ============================================================
  // CLIENTE PARA EDITAR
  // ============================================================

  // Guarda el cliente que se seleccionó con el lápiz.
  //
  // null significa que no hay cliente seleccionado.

  const [clienteEditar, setClienteEditar] = useState(null);


  // ============================================================
  // CLIENTE PARA ELIMINAR
  // ============================================================

  // Guarda el cliente que se seleccionó con el basurero.
  //
  // null significa que no hay cliente seleccionado.

  const [clienteEliminar, setClienteEliminar] = useState(null);


  // ============================================================
  // MENSAJES
  // ============================================================

  // Guarda un mensaje que puede mostrarse después de
  // crear, modificar o eliminar un cliente.

  const [mensaje, setMensaje] = useState(null);


  // ============================================================
  // cargarClientes
  //
  // Esta función consulta la API para obtener los clientes.
  // Puede recibir filtros.
  // ============================================================

  const cargarClientes = async (filtros = {}) => {

    // Activamos el estado de carga.

    setCargando(true);


    // Cada nueva búsqueda comienza desde la página 1.

    setPagina(1);


    try {

      // Consultamos la API.

      const datos = await listarClientes(filtros);


      // Guardamos los clientes obtenidos.

      setClientes(datos);

    } catch (err) {

      // Mostramos el error en la consola.

      console.error(err);


      // Informamos al usuario.

      setMensaje({
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'Ocurrió un error al buscar los clientes.'
      });

    } finally {

      // Terminamos el estado de carga,
      // haya ocurrido un error o no.

      setCargando(false);

    }
  };


  // ============================================================
  // cargarTodosClientes
  //
  // Vuelve a cargar todos los clientes.
  //
  // Esta función se utiliza después de insertar, modificar
  // o eliminar un cliente.
  // ============================================================

  const cargarTodosClientes = async () => {

    try {

      const datos = await listarClientes();

      setTodosClientes(datos);

      setClientes(datos);

    } catch (err) {

      console.error(err);

    }

  };


  // ============================================================
  // CARGA INICIAL
  // ============================================================

  useEffect(() => {

    // Cargamos inicialmente los clientes.

    cargarClientes();


    // También obtenemos todos los clientes para utilizarlos
    // en las estadísticas y en las opciones de los filtros.

    listarClientes()
      .then((datos) => setTodosClientes(datos))
      .catch(() => { });

  }, []);


  // ============================================================
  // aplicarFiltros
  //
  // Recibe los cambios realizados en los filtros.
  //
  // Combina esos cambios con los filtros que ya estaban
  // seleccionados.
  // ============================================================

  const aplicarFiltros = (cambios = {}) => {

    const filtros = {

      // Si "cambios" trae un nombre nuevo,
      // usamos ese nombre.
      //
      // Si no, conservamos el nombre actual.

      nombre:
        cambios.nombre !== undefined
          ? cambios.nombre
          : nombre,


      // Lo mismo para la categoría.

      categoria:
        cambios.categoria !== undefined
          ? cambios.categoria
          : categoria,


      // Lo mismo para el método de entrega.

      metodoEntrega:
        cambios.metodoEntrega !== undefined
          ? cambios.metodoEntrega
          : metodoEntrega,

    };


    // Ejecutamos la búsqueda con los filtros construidos.

    cargarClientes(filtros);

  };


  // ============================================================
  // restaurarFiltros
  //
  // Limpia todos los filtros y vuelve a cargar
  // todos los clientes.
  // ============================================================

  const restaurarFiltros = () => {

    setNombre('');

    setCategoria('');

    setMetodoEntrega('');

    setSeleccionados([]);

    cargarClientes();

  };


  // ============================================================
  // toggleSeleccion
  //
  // Selecciona o deselecciona un cliente.
  //
  // Recibe el CustomerID.
  // ============================================================

  const toggleSeleccion = (id) => {

    setSeleccionados((prev) =>

      // Preguntamos si el ID ya está seleccionado.

      prev.includes(id)

        ?

        // Si ya está seleccionado:
        // lo eliminamos de la lista.

        prev.filter((x) => x !== id)

        :

        // Si no está seleccionado:
        // lo agregamos a la lista.

        [...prev, id]

    );

  };


  // ============================================================
  // verUno
  //
  // Esto es cuando tocamos el ojo.
  //
  // Obtiene los detalles de un solo cliente.
  // ============================================================

  const verUno = async (id) => {

    try {

      // Consultamos la API utilizando el CustomerID.

      const detalle = await obtenerDetalleClientes(id);


      // Guardamos los datos para mostrarlos en el modal.

      setClientesModal(detalle);

    } catch (err) {

      console.error(err);

      setMensaje({
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'No se pudo cargar el detalle del cliente.'
      });

    }

  };


  // ============================================================
  // verSeleccionados
  //
  // Obtiene los detalles de todos los clientes
  // seleccionados mediante los checkbox.
  // ============================================================

  const verSeleccionados = async () => {

    try {

      // Enviamos la lista de CustomerID seleccionados.

      const detalle =
        await obtenerDetalleClientes(seleccionados);


      // Guardamos los resultados para el modal.

      setClientesModal(detalle);

    } catch (err) {

      console.error(err);

      setMensaje({
        tipo: 'error',
        titulo: 'Error',
        mensaje:
          'No se pudo cargar el detalle de los clientes seleccionados.'
      });

    }

  };


  // ============================================================
  // CLIENTE CREADO
  //
  // Se ejecuta cuando ClienteNuevoModal termina correctamente.
  // ============================================================

  const clienteCreado = async () => {

    // Cerramos el formulario.

    setMostrarNuevo(false);


    // Quitamos cualquier selección anterior.

    setSeleccionados([]);


    // Volvemos a cargar la información.

    await cargarTodosClientes();


    // Mostramos mensaje de éxito.

    setMensaje({
      tipo: 'exito',
      titulo: 'Cliente creado',
      mensaje: 'El cliente se creó correctamente.'
    });

  };


  // ============================================================
  // CLIENTE ACTUALIZADO
  //
  // Se ejecuta cuando ClienteEditarModal termina correctamente.
  // ============================================================

  const clienteActualizado = async () => {

    // Cerramos el formulario de edición.

    setClienteEditar(null);


    // Quitamos selecciones anteriores.

    setSeleccionados([]);


    // Volvemos a cargar la tabla.

    await cargarTodosClientes();


    // Mostramos mensaje de éxito.

    setMensaje({
      tipo: 'exito',
      titulo: 'Cliente actualizado',
      mensaje: 'El cliente se actualizó correctamente.'
    });

  };


  // ============================================================
  // CLIENTE ELIMINADO
  //
  // Se ejecuta cuando ClienteEliminarModal termina correctamente.
  // ============================================================

  const clienteEliminado = async () => {

    // Cerramos el modal.

    setClienteEliminar(null);


    // Quitamos selecciones anteriores.

    setSeleccionados([]);


    // Volvemos a cargar los clientes.

    await cargarTodosClientes();


    // Mostramos mensaje de éxito.

    setMensaje({
      tipo: 'exito',
      titulo: 'Cliente eliminado',
      mensaje: 'El cliente se eliminó correctamente.'
    });

  };


  // ============================================================
  // CATEGORÍAS DISPONIBLES
  // ============================================================

  // Obtenemos las categorías existentes en todos los clientes.
  //
  // new Set() elimina valores repetidos.
  //
  // filter(Boolean) elimina valores vacíos.
  //
  // sort() ordena alfabéticamente.

  const categoriasDisponibles = [

    ...new Set(

      todosClientes.map(

        (c) => c.Categoria_Cliente

      )

    )

  ]

    .filter(Boolean)

    .sort();


  // ============================================================
  // MÉTODOS DE ENTREGA DISPONIBLES
  // ============================================================

  const metodosDisponibles = [

    ...new Set(

      todosClientes.map(

        (c) => c.Metodo_Entrega

      )

    )

  ]

    .filter(Boolean)

    .sort();


  // ============================================================
  // PAGINACIÓN
  // ============================================================

  // Calculamos cuántas páginas existen.
  const totalPaginas = Math.max(
    1,
    Math.ceil(clientes.length / POR_PAGINA)
  );

  // Obtenemos únicamente los clientes que pertenecen
  // a la página actual.
  const clientesPagina = clientes.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA
  );

  // ============================================================
  // NÚMEROS DE PÁGINA DINÁMICOS
  // ============================================================

  // Como máximo mostramos 5 botones.
  // Los números se van desplazando conforme avanzamos.
  const numerosPagina = (() => {

    const maxBotones = 5;

    // Si existen 5 páginas o menos,
    // mostramos todas.
    if (totalPaginas <= maxBotones) {
      return Array.from(
        { length: totalPaginas },
        (_, i) => i + 1
      );
    }

    // Intentamos colocar la página actual
    // en el centro de los 5 botones.
    let inicio = pagina - 2;
    let fin = pagina + 2;

    // Si estamos al principio,
    // mantenemos 1, 2, 3, 4, 5.
    if (inicio < 1) {
      inicio = 1;
      fin = maxBotones;
    }

    // Si estamos al final,
    // mostramos las últimas 5 páginas.
    if (fin > totalPaginas) {
      fin = totalPaginas;
      inicio = totalPaginas - maxBotones + 1;
    }

    // Creamos los números.
    return Array.from(
      { length: fin - inicio + 1 },
      (_, i) => inicio + i
    );

  })();

  // ============================================================
  // FECHA Y HORA
  // ============================================================

  // Obtenemos la fecha y hora actual.

  const ahora = new Date();


  // Convertimos la fecha al formato de Costa Rica.

  const fechaTexto = ahora.toLocaleDateString(

    'es-CR',

    {

      weekday: 'short',

      day: '2-digit',

      month: 'short',

      year: 'numeric'

    }

  );


  // Convertimos la hora al formato de 24 horas.

  const horaTexto = ahora.toLocaleTimeString(

    'es-CR',

    {

      hour: '2-digit',

      minute: '2-digit',

      hour12: false

    }

  );


  // ============================================================
  // INTERFAZ
  // ============================================================

  return (

    <div>


      {/* ========================================================
          ENCABEZADO
          ======================================================== */}

      <div className="page-header">

        <div className="title-block">

          <div className="icon-box">

            <Users size={22} />

          </div>


          <div>

            <h1>
              Clientes
            </h1>

            <p>
              Consulta y busca clientes registrados
              en Wide World Importers.
            </p>

          </div>

        </div>


        <div className="header-right">

          <span>
            {fechaTexto} | {horaTexto}
          </span>


          <div className="sun-icon">

            <Sun size={16} />

          </div>

        </div>

      </div>


      {/* ========================================================
          ESTADÍSTICAS
          ======================================================== */}

      <div className="stats-row">

        <StatCard
          icon={Users}
          color="blue"
          label="Total de clientes"
          value={todosClientes.length}
        />


        <StatCard
          icon={Tag}
          color="green"
          label="Categorías"
          value={categoriasDisponibles.length}
        />


        <StatCard
          icon={CheckCircle2}
          color="yellow"
          label="Resultados actuales"
          value={clientes.length}
        />

      </div>


      {/* ========================================================
          TABLA
          ======================================================== */}

      <div className="table-card">


        {/* ======================================================
            BARRA DE HERRAMIENTAS
            ====================================================== */}

        <div className="toolbar">


          {/* BUSCADOR */}

          <div className="search-box">

            <Search size={16} />


            <input

              placeholder="Buscar por nombre..."

              value={nombre}

              onChange={(e) =>
                setNombre(e.target.value)
              }

              onKeyDown={(e) =>

                e.key === 'Enter' &&

                aplicarFiltros({
                  nombre: e.target.value
                })

              }

            />

          </div>


          {/* FILTRO CATEGORÍA */}

          <select

            value={categoria}

            onChange={(e) => {

              // Guardamos la categoría seleccionada.

              setCategoria(e.target.value);


              // Aplicamos el filtro.

              aplicarFiltros({

                categoria: e.target.value

              });

            }}

          >

            <option value="">

              Todas las categorías

            </option>


            {categoriasDisponibles.map((cat) => (

              <option

                key={cat}

                value={cat}

              >

                {cat}

              </option>

            ))}

          </select>


          {/* FILTRO MÉTODO DE ENTREGA */}

          <select

            value={metodoEntrega}

            onChange={(e) => {

              // Guardamos el método seleccionado.

              setMetodoEntrega(e.target.value);


              // Aplicamos el filtro.

              aplicarFiltros({

                metodoEntrega: e.target.value

              });

            }}

          >

            <option value="">

              Todos los métodos

            </option>


            {metodosDisponibles.map((met) => (

              <option

                key={met}

                value={met}

              >

                {met}

              </option>

            ))}

          </select>


          {/* RESTAURAR FILTROS */}

          <button

            className="btn-restaurar"

            onClick={restaurarFiltros}

          >

            Restaurar filtros

          </button>


          {/* VER SELECCIONADOS */}

          <button

            className="btn-filtros"

            disabled={seleccionados.length === 0}

            onClick={verSeleccionados}

            style={{

              opacity:

                seleccionados.length === 0

                  ? 0.5

                  : 1,

              cursor:

                seleccionados.length === 0

                  ? 'not-allowed'

                  : 'pointer'

            }}

          >

            <Eye size={16} />

            Ver seleccionados (

            {seleccionados.length}

            )

          </button>


          {/* ==================================================
              NUEVO CLIENTE
              ================================================== */}

          <button

            className="btn-nuevo"

            onClick={() => setMostrarNuevo(true)}

          >

            <Plus size={16} />

            Nuevo Cliente

          </button>

        </div>


        {/* ======================================================
            CARGANDO / TABLA
            ====================================================== */}

        {cargando ? (

          <p style={{ padding: '1rem' }}>

            Cargando...

          </p>

        ) : (

          <>


            {/* ==================================================
                TABLA DE CLIENTES

                Aquí enviamos también las funciones de editar
                y eliminar.
                ================================================== */}

            <ClientesTabla

              clientes={clientesPagina}

              seleccionados={seleccionados}

              onToggleSeleccion={toggleSeleccion}

              onVerUno={verUno}


              // Cuando se presiona el lápiz.

              onEditar={(cliente) => {

                setClienteEditar(cliente);

              }}


              // Cuando se presiona el basurero.

              onEliminar={(cliente) => {

                setClienteEliminar(cliente);

              }}

            />


            {/* ==================================================
    PAGINACIÓN
    ================================================== */}

            <div className="paginacion">

              <span>
                Mostrando{' '}

                {clientes.length === 0
                  ? 0
                  : (pagina - 1) * POR_PAGINA + 1}

                {' - '}

                {Math.min(
                  pagina * POR_PAGINA,
                  clientes.length
                )}

                {' de '}

                {clientes.length}

                {' resultados'}
              </span>


              <div className="paginas">

                {/* BOTÓN ANTERIOR */}

                <button
                  disabled={pagina === 1}
                  onClick={() =>
                    setPagina((p) =>
                      Math.max(1, p - 1)
                    )
                  }
                >
                  ‹
                </button>


                {/* NÚMEROS DE PÁGINA */}

                {numerosPagina.map((n) => (

                  <button
                    key={n}
                    className={
                      pagina === n
                        ? 'activo'
                        : ''
                    }
                    onClick={() =>
                      setPagina(n)
                    }
                  >
                    {n}
                  </button>

                ))}


                {/* BOTÓN SIGUIENTE */}

                <button
                  disabled={pagina === totalPaginas}
                  onClick={() =>
                    setPagina((p) =>
                      Math.min(
                        totalPaginas,
                        p + 1
                      )
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


      {/* ========================================================
          MODAL DE DETALLE
          ======================================================== */}

      <ClienteDetalleModal

        clientes={clientesModal}

        onCerrar={() =>

          setClientesModal(null)

        }

      />


      {/* ========================================================
          MODAL NUEVO CLIENTE
          ======================================================== */}

      {mostrarNuevo && (

        <ClienteNuevoModal

          onCerrar={() =>

            setMostrarNuevo(false)

          }

          onClienteCreado={clienteCreado}

          onMostrarMensaje={(nuevoMensaje) => {

            setMensaje(nuevoMensaje);

          }}

        />

      )}


      {/* ========================================================
          MODAL EDITAR CLIENTE
          ======================================================== */}

      {clienteEditar && (

        <ClienteEditarModal

          cliente={clienteEditar}

          onCerrar={() =>

            setClienteEditar(null)

          }

          onClienteActualizado={clienteActualizado}

          onMostrarMensaje={(nuevoMensaje) => {

            setMensaje(nuevoMensaje);

          }}

        />

      )}


      {/* ========================================================
          MODAL ELIMINAR CLIENTE
          ======================================================== */}

      {clienteEliminar && (

        <ClienteEliminarModal

          cliente={clienteEliminar}

          onCerrar={() =>

            setClienteEliminar(null)

          }

          onEliminado={clienteEliminado}

          onMostrarMensaje={(nuevoMensaje) => {

            setMensaje(nuevoMensaje);

          }}

        />

      )}


      {/* ========================================================
          MENSAJE
          ======================================================== */}

      {mensaje && (

        <div className="modal-overlay">

          <div className={`mensaje-modal ${mensaje.tipo}`}>

            <h2>
              {mensaje.titulo}
            </h2>

            <p>
              {mensaje.mensaje}
            </p>

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


export default ClientesPage;