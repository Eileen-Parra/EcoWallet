import { useState } from 'react'

const AVATARES = ['🧙', '⚔️', '🏹', '🗡️', '🔮', '🌿', '🦅', '🐉']

const CLASES = [
  {
    id: 'guardian',
    nombre: 'Guardián',
    emoji: '🛡️',
    descripcion: 'Protector del medio ambiente. Bonus en Transporte.',
    color: 'var(--cat-transport)',
  },
  {
    id: 'sabio',
    nombre: 'Sabio',
    emoji: '📖',
    descripcion: 'Conocedor de los consejos ecológicos. Bonus en Comida.',
    color: 'var(--cat-tech)',
  },
  {
    id: 'mercader',
    nombre: 'Mercader',
    emoji: '💰',
    descripcion: 'Maestro del ahorro. Bonus en Tecnología.',
    color: 'var(--gold)',
  },
  {
    id: 'explorador',
    nombre: 'Explorador',
    emoji: '🗺️',
    descripcion: 'Descubridor de rutas sostenibles. Bonus en Ropa.',
    color: 'var(--cat-clothes)',
  },
]

function ForgePage({ heroe, onActualizar, onNavegar, onReset }) {
  const [nombre, setNombre]   = useState(heroe.nombre)
  const [avatar, setAvatar]   = useState(heroe.avatar)
  const [clase, setClase]     = useState(heroe.clase)
  const [guardado, setGuardado] = useState(false)
  const [confirmarReset, setConfirmarReset] = useState(false)

  const cambios = nombre !== heroe.nombre ||
    avatar !== heroe.avatar ||
    clase  !== heroe.clase

  function handleGuardar() {
    if (!nombre.trim() || !cambios) return
    onActualizar({ nombre: nombre.trim(), avatar, clase })
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2000)
  }

  function handleReset() {
    if (confirmarReset) {
      onReset()
    } else {
      setConfirmarReset(true)
      setTimeout(() => setConfirmarReset(false), 3000)
    }
  }

  const claseActual = CLASES.find(c => c.id === clase)

  return (
    <div style={styles.contenedor}>

      {/* CABECERA */}
      <div style={styles.cabecera}>
        <div>
          <p style={styles.sobre}>— La Forja —</p>
          <h1 style={styles.titulo}>Configuración</h1>
        </div>
        <button style={styles.btnVolver} onClick={() => onNavegar('mapa')}>
          🗺️ Volver al mapa
        </button>
      </div>

      <div style={styles.lineaDivisora} />

      <div style={styles.contenido}>

        {/* PANEL IZQUIERDO */}
        <div style={styles.panelIzq}>

          {/* PREVIEW HEROE */}
          <div style={styles.card}>
            <p style={styles.cardTitulo}>👤 Tu héroe actual</p>
            <div style={styles.heroePreview}>
              <span style={styles.heroeEmoji}>{avatar}</span>
              <div>
                <p style={styles.heroeNombre}>{nombre || heroe.nombre}</p>
                <p style={{ ...styles.heroeClase, color: claseActual.color }}>
                  {claseActual.emoji} {claseActual.nombre}
                </p>
              </div>
            </div>
            {cambios && (
              <p style={styles.cambiosAviso}>
                ✦ Tienes cambios sin guardar
              </p>
            )}
          </div>

          {/* NOMBRE */}
          <div style={styles.card}>
            <p style={styles.cardTitulo}>✒️ Nombre del héroe</p>
            <input
              style={styles.input}
              value={nombre}
              maxLength={20}
              onChange={e => setNombre(e.target.value)}
              placeholder="Tu nombre..."
            />
            <p style={styles.hint}>Máximo 20 caracteres</p>
          </div>

          {/* AVATAR */}
          <div style={styles.card}>
            <p style={styles.cardTitulo}>🎭 Emblema</p>
            <div style={styles.avatarGrid}>
              {AVATARES.map(a => (
                <button
                  key={a}
                  style={{
                    ...styles.avatarBtn,
                    background: avatar === a ? 'var(--bg4)' : 'var(--bg3)',
                    border: avatar === a
                      ? '1px solid var(--silver-200)'
                      : '1px solid var(--border)',
                    transform: avatar === a ? 'scale(1.1)' : 'scale(1)',
                  }}
                  onClick={() => setAvatar(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* PANEL DERECHO */}
        <div style={styles.panelDer}>

          {/* CLASE */}
          <div style={styles.card}>
            <p style={styles.cardTitulo}>⚔️ Clase del héroe</p>
            <div style={styles.claseGrid}>
              {CLASES.map(c => (
                <button
                  key={c.id}
                  style={{
                    ...styles.claseBtn,
                    background: clase === c.id ? 'var(--bg4)' : 'var(--bg3)',
                    border: clase === c.id
                      ? `1px solid ${c.color}`
                      : '1px solid var(--border)',
                  }}
                  onClick={() => setClase(c.id)}
                >
                  <span style={{ fontSize: '24px' }}>{c.emoji}</span>
                  <span style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '12px',
                    color: clase === c.id ? c.color : 'var(--silver-200)',
                  }}>
                    {c.nombre}
                  </span>
                </button>
              ))}
            </div>
            <div style={{
              ...styles.claseDesc,
              borderColor: claseActual.color + '44',
            }}>
              <span style={{ fontSize: '18px' }}>{claseActual.emoji}</span>
              <p style={styles.claseDescTexto}>
                {claseActual.descripcion}
              </p>
            </div>
          </div>

          {/* BOTON GUARDAR */}
          <button
            style={{
              ...styles.btnGuardar,
              opacity: cambios && nombre.trim() ? 1 : 0.4,
              cursor:  cambios && nombre.trim() ? 'pointer' : 'not-allowed',
              background: guardado
                ? 'var(--cat-tech)' : 'var(--silver-200)',
            }}
            onClick={handleGuardar}
            disabled={!cambios || !nombre.trim()}
          >
            {guardado ? '✓ ¡Cambios guardados!' : '⚒️ Forjar cambios'}
          </button>

          {/* ZONA DE PELIGRO */}
          <div style={styles.peligro}>
            <p style={styles.peligroTitulo}>⚠️ Zona de Peligro</p>
            <p style={styles.peligroTexto}>
              Reiniciar el reino borrará todo tu progreso — gastos,
              héroe y misiones. Esta acción no se puede deshacer.
            </p>
            <button
              style={{
                ...styles.btnReset,
                background: confirmarReset ? 'var(--cat-food)' : 'transparent',
                color: confirmarReset ? '#fff' : 'var(--cat-food)',
              }}
              onClick={handleReset}
            >
              {confirmarReset
                ? '⚠️ ¿Confirmar? Se borrará todo'
                : '💀 Reiniciar el reino'}
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes aparecer {
          from { opacity: 0; transform: translateY(16px); }
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
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    animation: 'aparecer 0.5s ease',
  },
  cabecera: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sobre: {
    fontFamily: 'Crimson Text, serif',
    fontStyle: 'italic',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '4px',
  },
  titulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '26px',
    fontWeight: '700',
    color: 'var(--silver-100)',
    letterSpacing: '0.05em',
  },
  btnVolver: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: '3px',
    padding: '8px 14px',
    cursor: 'pointer',
  },
  lineaDivisora: {
    height: '1px',
    background: 'linear-gradient(90deg, var(--gold), transparent)',
  },
  contenido: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    alignItems: 'start',
  },
  panelIzq: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  panelDer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  cardTitulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    color: 'var(--silver-200)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  heroePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    background: 'var(--bg3)',
    borderRadius: '4px',
    border: '1px solid var(--border)',
  },
  heroeEmoji: {
    fontSize: '36px',
  },
  heroeNombre: {
    fontFamily: 'Cinzel, serif',
    fontSize: '16px',
    color: 'var(--silver-100)',
    fontWeight: '600',
  },
  heroeClase: {
    fontSize: '13px',
    fontStyle: 'italic',
    marginTop: '3px',
  },
  cambiosAviso: {
    fontSize: '12px',
    color: 'var(--gold)',
    fontStyle: 'italic',
    fontFamily: 'Crimson Text, serif',
    textAlign: 'center',
  },
  input: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: '3px',
    padding: '10px 14px',
    fontSize: '15px',
    fontFamily: 'Crimson Text, serif',
    color: 'var(--silver-100)',
    outline: 'none',
  },
  hint: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
  },
  avatarBtn: {
    fontSize: '24px',
    padding: '12px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  claseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  claseBtn: {
    padding: '14px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
  claseDesc: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--bg3)',
    border: '1px solid',
    borderRadius: '3px',
    padding: '10px 14px',
    transition: 'border-color 0.3s ease',
  },
  claseDescTexto: {
    fontFamily: 'Crimson Text, serif',
    fontSize: '13px',
    fontStyle: 'italic',
    color: 'var(--silver-300)',
    lineHeight: '1.5',
  },
  btnGuardar: {
    fontFamily: 'Cinzel, serif',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    color: 'var(--bg)',
    border: 'none',
    borderRadius: '3px',
    padding: '13px',
    transition: 'all 0.3s ease',
  },
  peligro: {
    background: 'var(--bg2)',
    border: '1px solid var(--cat-food)',
    borderRadius: '4px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  peligroTitulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    color: 'var(--cat-food)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  peligroTexto: {
    fontFamily: 'Crimson Text, serif',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    lineHeight: '1.5',
  },
  btnReset: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    border: '1px solid var(--cat-food)',
    borderRadius: '3px',
    padding: '10px 16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.03em',
  },
}

export default ForgePage