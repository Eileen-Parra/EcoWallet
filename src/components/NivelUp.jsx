import { useEffect, useState } from 'react'

function NivelUp({ nivel, onCerrar }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onCerrar, 500)
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      ...styles.overlay,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.5s ease',
    }}>
      <div style={{
        ...styles.panel,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transition: 'transform 0.5s ease',
      }}>

        {/* ESTRELLAS */}
        <div style={styles.estrellas}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.estrella,
                top:  `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                width:  `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
              }}
            />
          ))}
        </div>

        {/* CONTENIDO */}
        <p style={styles.sobre}>— Subiste de nivel —</p>

        <div style={styles.nivelEmoji}>{nivel.emoji}</div>

        <h1 style={styles.titulo}>¡Nivel {nivel.nivel}!</h1>

        <p style={styles.nombre}>{nivel.nombre}</p>

        <div style={styles.lineaDivisora} />

        <p style={styles.mensaje}>
          {mensajes[nivel.nivel] || '¡Sigue forjando tu legado!'}
        </p>

        <button style={styles.btn} onClick={() => {
          setVisible(false)
          setTimeout(onCerrar, 500)
        }}>
          ◆ Continuar
        </button>

      </div>

      <style>{`
        @keyframes brillar {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 1; }
        }
        @keyframes flotar {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes girar {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const mensajes = {
  2: 'El reino te ha reconocido como Aprendiz. Tu camino apenas comienza.',
  3: 'Has demostrado valor y disciplina. El título de Guardián es tuyo.',
  4: 'Pocos han llegado hasta aquí. La espada del Caballero brilla con tu nombre.',
  5: 'La sabiduría del Maestro ilumina el reino. Eres un ejemplo a seguir.',
  6: 'Tu nombre vivirá en los pergaminos eternamente. Eres una Leyenda.',
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backdropFilter: 'blur(4px)',
  },
  panel: {
    background: 'var(--bg2)',
    border: '1px solid var(--gold)',
    borderRadius: '4px',
    padding: '48px 40px',
    maxWidth: '420px',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
  },
  estrellas: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  estrella: {
    position: 'absolute',
    background: 'var(--gold)',
    borderRadius: '50%',
    animation: 'brillar 1.5s ease-in-out infinite',
  },
  sobre: {
    fontFamily: 'Crimson Text, serif',
    fontStyle: 'italic',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
  },
  nivelEmoji: {
    fontSize: '64px',
    animation: 'flotar 2s ease-in-out infinite',
    filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.5))',
  },
  titulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '36px',
    fontWeight: '700',
    color: 'var(--silver-100)',
    letterSpacing: '0.08em',
  },
  nombre: {
    fontFamily: 'Cinzel, serif',
    fontSize: '18px',
    color: 'var(--gold)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  lineaDivisora: {
    width: '120px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
  },
  mensaje: {
    fontFamily: 'Crimson Text, serif',
    fontSize: '15px',
    fontStyle: 'italic',
    color: 'var(--silver-300)',
    lineHeight: '1.6',
    maxWidth: '300px',
  },
  btn: {
    fontFamily: 'Cinzel, serif',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: 'var(--bg)',
    background: 'var(--silver-200)',
    border: 'none',
    borderRadius: '3px',
    padding: '12px 32px',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.2s ease',
  },
}

export default NivelUp