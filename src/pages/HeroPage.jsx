import { useState } from 'react'

const CLASES = [
  {
    id: 'guardian',
    nombre: 'Guardián',
    emoji: '🛡️',
    descripcion: 'Se encarga de proteger el medio ambiente. Recibe bonus en la categoría Transporte.',
    color: 'var(--cat-transport)',
  },
  {
    id: 'sabio',
    nombre: 'Sabio',
    emoji: '📖',
    descripcion: 'Es el conocedor de los consejos ecológicos. Recibe bonus en la categoría Comida.',
    color: 'var(--cat-tech)',
  },
  {
    id: 'mercader',
    nombre: 'Mercader',
    emoji: '💰',
    descripcion: 'El maestro del ahorro. Recibe bonus en la categoría Tecnología.',
    color: 'var(--gold)',
  },
  {
    id: 'explorador',
    nombre: 'Explorador',
    emoji: '🗺️',
    descripcion: 'El descubridor de rutas sostenibles. Recibe bonus en la categoría Ropa.',
    color: 'var(--cat-clothes)',
  },
]

const AVATARES = ['🧙', '⚔️', '🏹', '🗡️', '🔮', '🌿', '🦅', '🐉']

function HeroPage({ onConfirmar }) {
  const [nombre, setNombre] = useState('')
  const [avatarSel, setAvatarSel] = useState('🧙')
  const [claseSel, setClaseSel] = useState('guardian')
  const [paso, setPaso] = useState(1)
  const [saliendo, setSaliendo] = useState(false)

  function handleConfirmar() {
    if (!nombre.trim()) return
    setSaliendo(true)
    setTimeout(() => {
      onConfirmar({ nombre: nombre.trim(), avatar: avatarSel, clase: claseSel })
    }, 800)
  }

  const claseActual = CLASES.find(c => c.id === claseSel)

  return (
    <div style={{
      ...styles.contenedor,
      opacity: saliendo ? 0 : 1,
      transition: saliendo ? 'opacity 0.8s ease' : 'none',
    }}>
      <div style={styles.panel}>

        {/* CABECERA */}
        <div style={styles.cabecera}>
          <p style={styles.sobre}>— Crea tu personaje —</p>
          <h1 style={styles.titulo}>Forja tu Héroe</h1>
          <div style={styles.lineaDivisora} />
        </div>

        {/* PASOS */}
        <div style={styles.pasos}>
          {[1, 2, 3].map(n => (
            <div key={n} style={styles.pasoWrap}>
              <div style={{
                ...styles.pasoBola,
                background: paso >= n ? 'var(--silver-200)' : 'var(--bg3)',
                color: paso >= n ? 'var(--bg)' : 'var(--text-secondary)',
                border: paso >= n
                  ? '1px solid var(--silver-200)'
                  : '1px solid var(--border2)',
              }}>
                {n}
              </div>
              <span style={{
                ...styles.pasoLabel,
                color: paso >= n ? 'var(--silver-200)' : 'var(--text-muted)',
              }}>
                {n === 1 ? 'Nombre' : n === 2 ? 'Avatar' : 'Clase'}
              </span>
            </div>
          ))}
        </div>

        {/* PASO 1 — NOMBRE */}
        {paso === 1 && (
          <div style={styles.seccion}>
            <label style={styles.label}>¿Cómo se llamará tu héroe?</label>
            <input
              style={styles.input}
              placeholder="Escribe tu nombre..."
              value={nombre}
              maxLength={20}
              onChange={e => setNombre(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && nombre.trim() && setPaso(2)}
              autoFocus
            />
            <p style={styles.hint}>Máximo 20 caracteres · Presiona Enter para continuar</p>
            <button
              style={{
                ...styles.btnPrimario,
                opacity: nombre.trim() ? 1 : 0.4,
                cursor: nombre.trim() ? 'pointer' : 'not-allowed',
              }}
              onClick={() => nombre.trim() && setPaso(2)}
            >
              Continuar →
            </button>
          </div>
        )}

        {/* PASO 2 — AVATAR */}
        {paso === 2 && (
          <div style={styles.seccion}>
            <label style={styles.label}>Elige tu emblema</label>
            <div style={styles.avatarGrid}>
              {AVATARES.map(a => (
                <button
                  key={a}
                  style={{
                    ...styles.avatarBtn,
                    background: avatarSel === a ? 'var(--bg4)' : 'var(--bg3)',
                    border: avatarSel === a
                      ? '1px solid var(--silver-200)'
                      : '1px solid var(--border)',
                    transform: avatarSel === a ? 'scale(1.1)' : 'scale(1)',
                  }}
                  onClick={() => setAvatarSel(a)}
                >
                  {a}
                </button>
              ))}
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btnSecundario} onClick={() => setPaso(1)}>
                ← Volver
              </button>
              <button style={styles.btnPrimario} onClick={() => setPaso(3)}>
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 — CLASE */}
        {paso === 3 && (
          <div style={styles.seccion}>
            <label style={styles.label}>Elige tu clase</label>
            <div style={styles.claseGrid}>
              {CLASES.map(c => (
                <button
                  key={c.id}
                  style={{
                    ...styles.claseBtn,
                    background: claseSel === c.id ? 'var(--bg4)' : 'var(--bg3)',
                    border: claseSel === c.id
                      ? `1px solid ${c.color}`
                      : '1px solid var(--border)',
                  }}
                  onClick={() => setClaseSel(c.id)}
                >
                  <span style={{ fontSize: '28px' }}>{c.emoji}</span>
                  <span style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '13px',
                    color: claseSel === c.id ? c.color : 'var(--silver-200)',
                  }}>
                    {c.nombre}
                  </span>
                </button>
              ))}
            </div>

            {/* DESCRIPCION CLASE */}
            <div style={{
              ...styles.claseDesc,
              borderColor: claseActual.color,
            }}>
              <span style={{ fontSize: '20px' }}>{claseActual.emoji}</span>
              <p style={{ fontSize: '13px', color: 'var(--silver-300)', fontStyle: 'italic' }}>
                {claseActual.descripcion}
              </p>
            </div>

            <div style={styles.btnRow}>
              <button style={styles.btnSecundario} onClick={() => setPaso(2)}>
                ← Volver
              </button>
              <button style={styles.btnPrimario} onClick={handleConfirmar}>
                ⚔️ Comenzar misión
              </button>
            </div>
          </div>
        )}

        {/* PREVIEW HEROE */}
        {nombre && (
          <div style={styles.preview}>
            <span style={{ fontSize: '20px' }}>{avatarSel}</span>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '13px',
              color: 'var(--silver-200)' }}>
              {nombre}
            </span>
            {paso >= 3 && (
              <span style={{ fontSize: '12px', color: claseActual.color,
                fontStyle: 'italic' }}>
                · {claseActual.nombre}
              </span>
            )}
          </div>
        )}

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  panel: {
    background: 'var(--surface)',
    border: '1px solid var(--border2)',
    borderRadius: '4px',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    animation: 'aparecer 0.6s ease',
  },
  cabecera: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sobre: {
    fontFamily: 'Crimson Text, serif',
    fontStyle: 'italic',
    fontSize: '14px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
  },
  titulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--silver-100)',
    letterSpacing: '0.05em',
  },
  lineaDivisora: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
    margin: '4px auto',
    width: '160px',
  },
  pasos: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
  },
  pasoWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  pasoBola: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontFamily: 'Cinzel, serif',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  pasoLabel: {
    fontSize: '10px',
    fontFamily: 'Cinzel, serif',
    letterSpacing: '0.05em',
    transition: 'color 0.3s ease',
  },
  seccion: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    animation: 'aparecer 0.3s ease',
  },
  label: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    color: 'var(--silver-300)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  input: {
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    borderRadius: '3px',
    padding: '12px 16px',
    fontSize: '18px',
    fontFamily: 'Crimson Text, serif',
    color: 'var(--silver-100)',
    outline: 'none',
    letterSpacing: '0.05em',
  },
  hint: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  },
  avatarBtn: {
    fontSize: '28px',
    padding: '14px',
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
    padding: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  claseDesc: {
    background: 'var(--bg3)',
    border: '1px solid',
    borderRadius: '4px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'border-color 0.3s ease',
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
  },
  btnPrimario: {
    flex: 1,
    fontFamily: 'Cinzel, serif',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    color: 'var(--bg)',
    background: 'var(--silver-200)',
    border: 'none',
    borderRadius: '3px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  btnSecundario: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: '3px',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  preview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '10px',
    background: 'var(--bg3)',
    borderRadius: '3px',
    border: '1px solid var(--border)',
  },
}

export default HeroPage