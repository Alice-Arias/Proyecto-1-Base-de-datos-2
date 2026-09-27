
// StatCard
// Este componente crea una tarjeta para mostrar una estadística.
// La tarjeta puede mostrar:
// - Un icono.
// - Un color.
// - Un título o etiqueta.
// - Un valor principal.
// - Un cambio o texto adicional.
// - Una barra de progreso.
// Dependiendo de si recibe "progress", muestra una barra
// de progreso o muestra información adicional debajo.

function StatCard({
  icon: Icon,
  color,
  label,
  value,
  delta,
  sub,
  progress
}) {



  return (

    <div className="stat-card">



      <div className="stat-top">



        <div className={`stat-icon ${color}`}>


          <Icon size={20} />

        </div>



        <div>


          <div className="stat-label">
            {label}
          </div>


          <div className="stat-value">
            {value}
          </div>

        </div>

      </div>



      {progress !== undefined ? (



        <div className="stat-progress">


          <div


            className="stat-progress-fill"



            style={{
              width: `${progress}%`,


              background:
                color === 'green'
                  ? 'var(--green)'
                  : 'var(--yellow)'
            }}

          />

        </div>

      ) : (


        <div className="stat-sub">


          {delta && (
            <span className="stat-delta">
              {delta}
            </span>
          )}


          {sub}


        </div>

      )}

    </div>
  );
}


export default StatCard;
