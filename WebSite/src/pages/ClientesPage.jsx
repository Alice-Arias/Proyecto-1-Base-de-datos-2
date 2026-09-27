
// useEffect → permite ejecutar código cuando el componente
// se carga o cuando cambian ciertas dependencias.
// useState → permite guardar información que puede cambiar.

import { useEffect, useState } from 'react';

import {
  Users,
  CheckCircle2,
  Tag,
  Search,
  Plus,
  Sun,
  Eye
} from 'lucide-react';


import ClientesTabla from '../components/ClientesTabla';
import ClienteDetalleModal from '../components/ClienteDetalleModal';
import StatCard from '../components/StatCard';


// Funciones que se comunican con la API.
import {
  listarClientes,
  obtenerDetalleClientes
} from '../services/api';


// Cantidad máxima de clientes que se muestran por página.

const POR_PAGINA = 10;



// ClientesPage
// Esta es la página principal de clientes.
// Aquí se controla:
// - Carga de clientes.
// - Filtros.
// - Selección de clientes.
// - Consulta de detalles.
// - Estadísticas.
// - Paginación.
// - Estado de carga.
// ============================================================

function ClientesPage() {

  // Clientes que actualmente se están mostrando.
  // Puede ser la lista completa o una lista filtrada.
  const [clientes, setClientes] = useState([]);


  // Guarda todos los clientes sin filtrar.
  // Se utiliza principalmente para obtener las categorías
  // y métodos de entrega disponibles.

  const [todosClientes, setTodosClientes] = useState([]);


  // Texto escrito en el filtro de nombre.
  const [nombre, setNombre] = useState('');


  // Categoría seleccionada.
  const [categoria, setCategoria] = useState('');


  // Método de entrega seleccionado.
  const [metodoEntrega, setMetodoEntrega] = useState('');


  // Guarda los CustomerID de los clientes seleccionados.
  const [seleccionados, setSeleccionados] = useState([]);


  // Guarda los clientes que se mostrarán dentro del modal.
  // null significa que el modal está cerrado.

  const [clientesModal, setClientesModal] = useState(null);

  // Indica si actualmente se están cargando clientes.
  const [cargando, setCargando] = useState(false);


  // Número de página actual.
  const [pagina, setPagina] = useState(1);



  //  cargarClientes
  // Esta función consulta la API para obtener los clientes.
  // Puede recibir filtros.

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
      alert('Ocurrió un error al buscar los clientes');


    } finally {


      // Terminamos el estado de carga,
      // haya ocurrido un error o no.
      setCargando(false);
    }
  };

  useEffect(() => {


    // Cargamos inicialmente los clientes.
    cargarClientes();


    // También obtenemos todos los clientes para utilizarlos
    // en las estadísticas y en las opciones de los filtros.
    listarClientes()
      .then((datos) => setTodosClientes(datos))
      .catch(() => {});


  }, []);



  // aplicarFiltros

  // Recibe los cambios realizados en los filtros.
  // Combina esos cambios con los filtros que ya estaban
  // seleccionados.


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




  // restaurarFiltros

  // Limpia todos los filtros y vuelve a cargar
  // todos los clientes.

  const restaurarFiltros = () => {


    setNombre('');

    setCategoria('');

    setMetodoEntrega('');

    setSeleccionados([]);

    cargarClientes();
  };



  //  toggleSeleccion
  // Selecciona o deselecciona un cliente.
  // Recibe el CustomerID.


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



  //  verUno esto es cuando tocamos el ojo
  // Obtiene los detalles de un solo cliente.


  const verUno = async (id) => {

    try {


      // Consultamos la API utilizando el CustomerID.
      const detalle = await obtenerDetalleClientes(id);
      setClientesModal(detalle);


    } catch (err) {


      console.error(err);

      alert('No se pudo cargar el detalle del cliente');
    }
  };



  // verSeleccionados
  // Obtiene los detalles de todos los clientes
  // seleccionados mediante los checkbox.

  const verSeleccionados = async () => {


    try {


      // Enviamos la lista de CustomerID seleccionados.
      const detalle = await obtenerDetalleClientes(seleccionados);


      // Guardamos los resultados para el modal.
      setClientesModal(detalle);

    } catch (err) {

      console.error(err);

      alert(
        'No se pudo cargar el detalle de los clientes seleccionados'
      );
    }
  };



  // CATEGORÍAS DISPONIBLES
  // Obtenemos las categorías existentes en todos los clientes
  // new Set() elimina valores repetidos.
  // filter(Boolean) elimina valores vacíos.
  // sort()ordena alfabéticamente.
  // ==========================================================

  const categoriasDisponibles = [
    ...new Set(
      todosClientes.map(
        (c) => c.Categoria_Cliente
      )
    )
  ]
    .filter(Boolean)
    .sort();



  // MÉTODOS DE ENTREGA DISPONIBLES
  const metodosDisponibles = [
    ...new Set(
      todosClientes.map(
        (c) => c.Metodo_Entrega
      )
    )
  ]
    .filter(Boolean)
    .sort();



  // PAGINACIÓN
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


  // Creamos los números de página que aparecerán.
  // Como máximo mostramos 5 botones.
  const numerosPagina = Array.from(
    {
      length: Math.min(totalPaginas, 5)
    },
    (_, i) => i + 1
  );



  // FECHA Y HORA
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



  return (

    <div>


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


        {/* Cantidad de resultados actuales */}

        <StatCard
          icon={CheckCircle2}
          color="yellow"
          label="Resultados actuales"
          value={clientes.length}
        />

      </div>




      <div className="table-card">


        <div className="toolbar">


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




          <button
            className="btn-restaurar"
            onClick={restaurarFiltros}
          >
            Restaurar filtros
          </button>




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




          <button className="btn-nuevo">

            <Plus size={16} />

            Nuevo Cliente

          </button>

        </div>




        {cargando ? (


          <p style={{ padding: '1rem' }}>
            Cargando...
          </p>

        ) : (

          <>


            <ClientesTabla

              clientes={clientesPagina}

              seleccionados={seleccionados}

              onToggleSeleccion={toggleSeleccion}

              onVerUno={verUno}

            />




            <div className="paginacion">


              <span>

                Mostrando{' '}

                {(pagina - 1) * POR_PAGINA + 1}

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

                <button
                  onClick={() =>
                    setPagina((p) =>
                      Math.max(1, p - 1)
                    )
                  }
                >
                  ‹
                </button>

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


                <button
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



      <ClienteDetalleModal

        clientes={clientesModal}

        onCerrar={() =>
          setClientesModal(null)
        }

      />

    </div>
  );
}



export default ClientesPage;

