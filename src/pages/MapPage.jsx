import { useState } from 'react'

const DESTINOS = [
  {
    id: 'dashboard',
    nombre: 'El Castillo',
    subtitulo: 'Tu reino de un vistazo',
    emoji: '🏰',
    color: 'var(--silver-300)',
    descripcion: 'Observa el estado de tu reino, tus Gastos, producción de CO₂ y progreso general.',
  },
  {
    id: 'registrar',
    nombre: 'La Armería',
    subtitulo: 'Registrar un gasto',
    emoji: '⚔️',
    color: 'var(--cat-food)',
    descripcion: 'Añade un nuevo gasto al pergamino y calcula su huella ambiental.',
  },
  {
    id: 'pergaminos',
    nombre: 'La Biblioteca',
    subtitulo: 'Mis pergaminos',
    emoji: '📜',
    color: 'var(--cat-transport)',
    descripcion: 'Consulta el historial completo de tus gastos y filtra por categoría.',
  },
  {
    id: 'stats',
    nombre: 'El Observatorio',
    subtitulo: 'Estadísticas del reino',
    emoji: '📊',
    color: 'var(--cat-clothes)',
    descripcion: 'Analiza tus patrones de gasto y tu impacto ambiental en el paso del tiempo.',
  },
  {
    id: 'manual',
    nombre: 'El Grimorio',
    subtitulo: 'Manual del aventurero',
    emoji: '📖',
    color: 'var(--cat-tech)',
    descripcion: 'Descubre consejos ecológicos y desbloquea misiones para ganar XP y aportar al reino.',
  },
  {
    id: 'forja',
    nombre: 'La Forja',
    subtitulo: 'Configuración',
    emoji: '⚙️',
    color: 'var(--gold)',
    descripcion: 'Cambia tu nombre, avatar, clase y preferencias de la app.',
  },
]

function MapPage({ heroe, onNavegar }) {
  const [hover, setHover] = useState(null)
  const destinoHover = DESTINOS.find(d => d.id === hover)

  return (
    <div style={styles.contenedor}>

      {/* CABECERA */}
      <div style={styles.cabecera}>
        <div style={styles.heroeInfo}>
          <span style={styles.heroeAvatar}>{heroe.avatar}</span>
          <div>
            <p style={styles.heroeNombre}>
              {heroe.nombre}
            </p>
            <p style={styles.heroeClase}>
              {heroe.clase.charAt(0).toUpperCase() + heroe.clase.slice(1)} · 620 XP
            </p>
          </div>
        </div>
        <div style={styles.xpWrap}>
          <div style={styles.xpBar}>
            <div style={styles.xpFill} />
          </div>
          <p style={styles.xpTexto}>Nivel 3 · 620 / 1000 XP</p>
        </div>
      </div>

      {/* TITULO */}
      <div style={styles.tituloWrap}>
        <div style={styles.lineaCorta} />
        <h1 style={styles.titulo}>Mapa del Reino</h1>
        <div style={styles.lineaCorta} />
      </div>
      <p style={styles.subtitulo}>
        ¿A dónde desea viajar hoy {heroe.nombre}?
      </p>

      {/* GRID DE DESTINOS */}
      <div style={styles.grid}>
        {DESTINOS.map(d => (
          <button
            key={d.id}
            style={{
              ...styles.destino,
              borderColor: hover === d.id ? d.color : 'var(--border)',
              background: hover === d.id ? 'var(--bg3)' : 'var(--bg2)',
              transform: hover === d.id ? 'translateY(-4px)' : 'translateY(0)',
            }}
            onMouseEnter={() => setHover(d.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onNavegar(d.id)}
          >
            <div style={{
              ...styles.destinoIcono,
              background: hover === d.id ? d.color + '22' : 'var(--bg3)',
              border: `1px solid ${hover === d.id ? d.color : 'var(--border)'}`,
            }}>
              <span style={{ fontSize: '28px' }}>{d.emoji}</span>
            </div>
            <p style={{
              ...styles.destinoNombre,
              color: hover === d.id ? d.color : 'var(--silver-200)',
            }}>
              {d.nombre}
            </p>
            <p style={styles.destinoSub}>{d.subtitulo}</p>
          </button>
        ))}
      </div>

      {/* DESCRIPCION AL HACER HOVER */}
      <div style={{
        ...styles.descripcion,
        opacity: destinoHover ? 1 : 0,
        transform: destinoHover ? 'translateY(0)' : 'translateY(6px)',
      }}>
        {destinoHover && (
          <>
            <span style={{ color: destinoHover.color }}>
              {destinoHover.emoji} {destinoHover.nombre}
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>·</span>
            <span style={{ fontStyle: 'italic' }}>
              {destinoHover.descripcion}
            </span>
          </>
        )}
      </div>

      <style>{`
        @keyframes aparecer {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  contenedor: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 24px',
    gap: '24px',
    animation: 'aparecer 0.6s ease',
  },
  cabecera: {
    width: '100%',
    maxWidth: '700px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '14px 20px',
  },
  heroeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  heroeAvatar: {
    fontSize: '28px',
  },
  heroeNombre: {
    fontFamily: 'Cinzel, serif',
    fontSize: '15px',
    color: 'var(--silver-100)',
  },
  heroeClase: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    marginTop: '2px',
  },
  xpWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '5px',
  },
  xpBar: {
    width: '140px',
    height: '5px',
    background: 'var(--bg4)',
    borderRadius: '2px',
    overflow: 'hidden',
    border: '1px solid var(--border)',
  },
  xpFill: {
    width: '62%',
    height: '100%',
    background: 'linear-gradient(90deg, var(--silver-500), var(--silver-200))',
    borderRadius: '2px',
  },
  xpTexto: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontFamily: 'Cinzel, serif',
    letterSpacing: '0.03em',
  },
  tituloWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  lineaCorta: {
    width: '60px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--gold))',
  },
  titulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '26px',
    fontWeight: '700',
    color: 'var(--silver-100)',
    letterSpacing: '0.08em',
  },
  subtitulo: {
    fontFamily: 'Crimson Text, serif',
    fontSize: '16px',
    fontStyle: 'italic',
    color: 'var(--text-secondary)',
    marginTop: '-12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px',
    width: '100%',
    maxWidth: '700px',
  },
  destino: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '24px 16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.2s ease',
  },
  destinoIcono: {
    width: '56px',
    height: '56px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  destinoNombre: {
    fontFamily: 'Cinzel, serif',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.04em',
    transition: 'color 0.2s ease',
  },
  destinoSub: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  descripcion: {
    width: '100%',
    maxWidth: '700px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    fontSize: '13px',
    color: 'var(--silver-300)',
    fontFamily: 'Crimson Text, serif',
    padding: '12px 16px',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    minHeight: '46px',
  },
}

export default MapPage