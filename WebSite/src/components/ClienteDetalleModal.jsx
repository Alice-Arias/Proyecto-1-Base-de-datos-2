
// Este componente muestra la información detallada de uno o
// varios clientes dentro de una ventana modal.
// Recibe dos datos desde el componente padre:
// clientes: lista de clientes que se quieren mostrar.
// onCerrar: función que cierra el modal.
// ============================================================

function ClienteDetalleModal({ clientes, onCerrar }) {

  if (!clientes || clientes.length === 0) {
    return null;
  }

  return (
    <div className="modal-fondo">
      <div className="modal-contenido">

        <button
          className="cerrar"
          onClick={onCerrar}
        >
          X
        </button>



        {clientes.map((cliente, idx) => {


          const mapaUrl =
            cliente.Latitud && cliente.Longitud

              ? `https://www.openstreetmap.org/export/embed.html?bbox=${
                  cliente.Longitud - 0.01
                }%2C${
                  cliente.Latitud - 0.01
                }%2C${
                  cliente.Longitud + 0.01
                }%2C${
                  cliente.Latitud + 0.01
                }&marker=${
                  cliente.Latitud
                }%2C${
                  cliente.Longitud
                }`

              : null;

          return (
            <div

              key={idx}

              style={{
                marginBottom: '1.5rem',
                paddingBottom: '1.5rem',

                borderBottom:
                  idx < clientes.length - 1
                    ? '1px solid #0055ff'
                    : 'none',
              }}
            >


              <h2>
                {cliente.Nombre_Cliente}
              </h2>

              <p>
                <strong>Categoría:</strong>{' '}
                {cliente.Categoria}
              </p>

              <p>
                <strong>Grupo de compra:</strong>{' '}
                {cliente.Grupo_Compra || '-'}
              </p>

              <p>
                <strong>Contacto primario:</strong>{' '}
                {cliente.Contacto_Primario || '-'}
              </p>

              <p>
                <strong>Contacto alternativo:</strong>{' '}
                {cliente.Contacto_Alternativo || '-'}
              </p>

              <p>
                <strong>Cliente por facturar:</strong>{' '}
                {cliente.Cliente_Por_Facturar || '-'}
              </p>


              <p>
                <strong>Método de entrega:</strong>{' '}
                {cliente.Metodo_Entrega || '-'}
              </p>

              <p>
                <strong>Ciudad de entrega:</strong>{' '}
                {cliente.Ciudad_Entrega || '-'}
              </p>

              <p>
                <strong>Código postal:</strong>{' '}
                {cliente.Codigo_Postal || '-'}
              </p>


              <p>
                <strong>Teléfono:</strong>{' '}
                {cliente.Telefono || '-'}
              </p>

              <p>
                <strong>Fax:</strong>{' '}
                {cliente.Fax || '-'}
              </p>

              <p>
                <strong>Días de gracia:</strong>{' '}
                {cliente.Dias_De_Gracia}
              </p>

              <p>
                <strong>Sitio web:</strong>{' '}
                {cliente.Sitio_Web ? (
                  <a
                    href={cliente.Sitio_Web}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {cliente.Sitio_Web}
                  </a>
                ) : ( '-' )}

              </p>


              <p>
                <strong>Dirección de entrega:</strong>{' '}
                {cliente.Direccion_Entrega1}{' '}
                {cliente.Direccion_Entrega2}
              </p>

              <p>
                <strong>Dirección postal:</strong>{' '}
                {cliente.Direccion_Postal1}{' '}
                {cliente.Direccion_Postal2}
              </p>

              {mapaUrl && (

                <iframe
                  title={`mapa-cliente-${idx}`}
                  width="100%"
                  height="220"
                  src={mapaUrl}

                  style={{
                    border: 0,
                    marginTop: '0.8rem'
                  }}
                />

              )}

            </div>

          );
        })}

      </div>

    </div>
  );
}

export default ClienteDetalleModal;
