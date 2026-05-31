import { useState, useEffect } from 'react'

const TITULO = 'EcoWallet'
const SUBTITULO = 'Forjando tu legado cuidas al mundo.'

function IntroPage({ onEntrar }) {
  const [letrasT, setLetrasT] = useState(0)
  const [letrasS, setLetrasS] = useState(0)
  const [mostrarBtn, setMostrarBtn] = useState(false)
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    let i = 0
    const intervaloT = setInterval(() => {
      i++
      setLetrasT(i)
      if (i >= TITULO.length) clearInterval(intervaloT)
    }, 120)
    return () => clearInterval(intervaloT)
  }, [])

  useEffect(() => {
    if (letrasT < TITULO.length) return
    const delay = setTimeout(() => {
      let j = 0
      const intervaloS = setInterval(() => {
        j++
        setLetrasS(j)
        if (j >= SUBTITULO.length) {
          clearInterval(intervaloS)
          setTimeout(() => setMostrarBtn(true), 400)
        }
      }, 40)
      return () => clearInterval(intervaloS)
    }, 300)
    return () => clearTimeout(delay)
  }, [letrasT])

  function handleEntrar() {
    setSaliendo(true)
    setTimeout(() => onEntrar(), 800)
  }

  return (
    <div style={{
      ...styles.contenedor,
      opacity: saliendo ? 0 : 1,
      transition: saliendo ? 'opacity 0.8s ease' : 'none',
    }}>
      <div style={styles.estrellas}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.estrella,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>

      <div style={styles.centro}>
        <div style={styles.emblema}>🌿</div>

        <h1 style={styles.titulo}>
          {TITULO.slice(0, letrasT)}
          {letrasT < TITULO.length && (
            <span style={styles.cursor}>|</span>
          )}
        </h1>

        <p style={styles.subtitulo}>
          {SUBTITULO.slice(0, letrasS)}
          {letrasT >= TITULO.length && letrasS < SUBTITULO.length && (
            <span style={styles.cursor}>|</span>
          )}
        </p>

        <div style={{
          ...styles.lineaDivisora,
          width: letrasS >= SUBTITULO.length ? '200px' : '0px',
          transition: 'width 0.8s ease',
        }} />

        {mostrarBtn && (
          <button
            style={styles.boton}
            onClick={handleEntrar}
            onMouseEnter={e => {
              e.target.style.background = 'var(--silver-200)'
              e.target.style.color = 'var(--bg)'
              e.target.style.letterSpacing = '0.2em'
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent'
              e.target.style.color = 'var(--silver-200)'
              e.target.style.letterSpacing = '0.15em'
            }}
          >
            ◆ COMENZAR AVENTURA
          </button>
        )}

        {mostrarBtn && (
          <p style={styles.version}>v1.0 · ODS 12 · Producción y consumo responsables</p>
        )}
      </div>

      <style>{`
        @keyframes parpadeo {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes brillar {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes flotar {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes aparecer {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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
    position: 'relative',
    overflow: 'hidden',
  },
  estrellas: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  estrella: {
    position: 'absolute',
    background: 'var(--silver-300)',
    borderRadius: '50%',
    animation: 'brillar 2s ease-in-out infinite',
  },
  centro: {
    textAlign: 'center',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  emblema: {
    fontSize: '64px',
    animation: 'flotar 3s ease-in-out infinite',
    filter: 'drop-shadow(0 0 20px #1e8449)',
  },
  titulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '64px',
    fontWeight: '700',
    color: 'var(--silver-100)',
    letterSpacing: '0.1em',
    textShadow: '0 0 40px rgba(192,192,192,0.3)',
    minHeight: '80px',
  },
  cursor: {
    animation: 'parpadeo 0.8s step-end infinite',
    color: 'var(--gold)',
  },
  subtitulo: {
    fontFamily: 'Crimson Text, serif',
    fontSize: '20px',
    fontStyle: 'italic',
    color: 'var(--silver-300)',
    letterSpacing: '0.05em',
    minHeight: '30px',
  },
  lineaDivisora: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
    overflow: 'hidden',
  },
  boton: {
    fontFamily: 'Cinzel, serif',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.15em',
    color: 'var(--silver-200)',
    background: 'transparent',
    border: '1px solid var(--silver-400)',
    padding: '14px 40px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: 'aparecer 0.6s ease',
    marginTop: '10px',
  },
  version: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontFamily: 'Crimson Text, serif',
    fontStyle: 'italic',
    animation: 'aparecer 0.6s ease',
    letterSpacing: '0.05em',
  },
}

export default IntroPage