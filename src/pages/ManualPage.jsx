import { useState } from 'react'

const CAPITULOS = [
  {
    id: 'alimentacion',
    titulo: 'El Arte de la Alimentación',
    emoji: '🍖',
    color: 'var(--cat-food)',
    desbloqueado: true,
    consejos: [
      {
        id: 1,
        titulo: 'Cocina en el castillo',
        texto: 'Cocinar en casa puede reducir hasta 2 kg de CO₂ al mes comparado con pedir domicilio y ahorra hasta un 60% en gastos de alimentación.',
        mision: 'Registra 3 gastos de mercado esta semana',
        xp: 50,
      },
      {
        id: 2,
        titulo: 'Mercados locales',
        texto: 'Comprar en mercados locales reduce el transporte de alimentos hasta un 90%. Los productos viajan menos kilómetros y son más frescos.',
        mision: 'Registra un gasto en mercado campesino',
        xp: 40,
      },
      {
        id: 3,
        titulo: 'La carne y el reino',
        texto: 'Reducir el consumo de carne roja 2 días a la semana puede ahorrar hasta 300 kg de CO₂ al año — equivalente a 2.500 km en auto.',
        mision: 'Prueba una semana sin carne roja',
        xp: 80,
      },
    ],
  },
  {
    id: 'transporte',
    titulo: 'Los Caminos del Reino',
    emoji: '🚌',
    color: 'var(--cat-transport)',
    desbloqueado: true,
    consejos: [
      {
        id: 4,
        titulo: 'El transporte público',
        texto: 'El transporte público genera 4 veces menos CO₂ que el auto particular. Cada viaje en bus es una victoria para el reino.',
        mision: 'Usa transporte público 5 días seguidos',
        xp: 60,
      },
      {
        id: 5,
        titulo: 'La ruta a pie',
        texto: 'Caminar distancias menores a 2 km en vez de tomar taxi elimina completamente la huella de carbono del trayecto y mejora tu salud.',
        mision: 'Camina al menos 3 destinos esta semana',
        xp: 45,
      },
    ],
  },
  {
    id: 'ropa',
    titulo: 'La Armadura Sostenible',
    emoji: '👕',
    color: 'var(--cat-clothes)',
    desbloqueado: true,
    consejos: [
      {
        id: 6,
        titulo: 'La armadura de segunda mano',
        texto: 'Comprar ropa de segunda mano reduce hasta un 70% el impacto ambiental. Los mejores guerreros reutilizan su armadura.',
        mision: 'Compra una prenda de segunda mano',
        xp: 70,
      },
      {
        id: 7,
        titulo: 'Calidad sobre cantidad',
        texto: 'Una prenda de calidad dura 3 veces más que una barata. A largo plazo gastas menos dinero y generas menos residuos textiles.',
        mision: 'No compres ropa por 2 semanas',
        xp: 90,
      },
    ],
  },
  {
    id: 'tech',
    titulo: 'Los Artefactos del Sabio',
    emoji: '💻',
    color: 'var(--cat-tech)',
    desbloqueado: false,
    consejos: [
      {
        id: 8,
        titulo: 'Repara antes de reemplazar',
        texto: 'Reparar un dispositivo en vez de comprar uno nuevo ahorra hasta 80 kg de CO₂ y puede ser hasta 5 veces más barato.',
        mision: 'Repara un dispositivo en vez de reemplazarlo',
        xp: 100,
      },
      {
        id: 9,
        titulo: 'El modo oscuro ahorra energía',
        texto: 'En pantallas OLED el modo oscuro puede reducir el consumo energético hasta un 40%. Un pequeño cambio, un gran impacto.',
        mision: 'Activa el modo oscuro en todos tus dispositivos',
        xp: 30,
      },
    ],
  },
  {
    id: 'sabiduria',
    titulo: 'La Sabiduría Suprema',
    emoji: '📖',
    color: 'var(--gold)',
    desbloqueado: false,
    consejos: [
      {
        id: 10,
        titulo: 'El poder del no',
        texto: 'Antes de cada compra pregúntate: ¿lo necesito o lo deseo? El 40% de las compras impulsivas se arrepienten en menos de 24 horas.',
        mision: 'Espera 24 horas antes de una compra no planificada',
        xp: 120,
      },
    ],
  },
]

function ManualPage({ heroe, onNavegar }) {
  const [capituloAbierto, setCapituloAbierto] = useState('alimentacion')
  const [misionesAceptadas, setMisionesAceptadas] = useState([])

  const capActual = CAPITULOS.find(c => c.id === capituloAbierto)

  function toggleMision(id) {
    setMisionesAceptadas(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    )
  }

  const xpTotal = CAPITULOS
    .flatMap(c => c.consejos)
    .filter(c => misionesAceptadas.includes(c.id))
    .reduce((s, c) => s + c.xp, 0)

  return (
    <div style={styles.contenedor}>

      {/* CABECERA */}
      <div style={styles.cabecera}>
        <div>
          <p style={styles.sobre}>— El Grimorio —</p>
          <h1 style={styles.titulo}>Manual del Aventurero</h1>
        </div>
        <button style={styles.btnVolver} onClick={() => onNavegar('mapa')}>
          🗺️ Volver al mapa
        </button>
      </div>

      <div style={styles.lineaDivisora} />

      {/* XP DISPONIBLE */}
      {misionesAceptadas.length > 0 && (
        <div style={styles.xpBanner}>
          <span style={{ fontSize: '20px' }}>⚡</span>
          <p style={styles.xpBannerTexto}>
            Tienes <strong style={{ color: 'var(--gold)' }}>
              {xpTotal} XP
            </strong> en misiones activas —{' '}
            {misionesAceptadas.length} misión{misionesAceptadas.length > 1 ? 'es' : ''} aceptada{misionesAceptadas.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div style={styles.contenido}>

        {/* INDICE */}
        <div style={styles.indice}>
          <p style={styles.indiceTitulo}>📚 Capítulos</p>
          {CAPITULOS.map(cap => (
            <button
              key={cap.id}
              style={{
                ...styles.indiceItem,
                background: capituloAbierto === cap.id
                  ? 'var(--bg3)' : 'transparent',
                border: capituloAbierto === cap.id
                  ? `1px solid ${cap.color}`
                  : '1px solid transparent',
                opacity: cap.desbloqueado ? 1 : 0.5,
              }}
              onClick={() => cap.desbloqueado && setCapituloAbierto(cap.id)}
            >
              <span style={{ fontSize: '18px' }}>{cap.emoji}</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '11px',
                  color: capituloAbierto === cap.id
                    ? cap.color : 'var(--silver-200)',
                }}>
                  {cap.titulo}
                </p>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)',
                  fontStyle: 'italic' }}>
                  {cap.desbloqueado
                    ? `${cap.consejos.length} consejos`
                    : '🔒 Bloqueado'}
                </p>
              </div>
              {misionesAceptadas.some(m =>
                cap.consejos.map(c => c.id).includes(m)
              ) && (
                <span style={{ fontSize: '10px', color: 'var(--gold)' }}>
                  ⚡
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENIDO DEL CAPITULO */}
        <div style={styles.capitulo}>
          <div style={styles.capituloHeader}>
            <span style={{ fontSize: '32px' }}>{capActual.emoji}</span>
            <div>
              <h2 style={{ ...styles.capituloTitulo,
                color: capActual.color }}>
                {capActual.titulo}
              </h2>
              <p style={styles.capituloSub}>
                {capActual.consejos.length} pergaminos de sabiduría
              </p>
            </div>
          </div>

          <div style={styles.consejosLista}>
            {capActual.consejos.map(consejo => {
              const aceptado = misionesAceptadas.includes(consejo.id)
              return (
                <div
                  key={consejo.id}
                  style={{
                    ...styles.consejo,
                    borderColor: aceptado
                      ? capActual.color : 'var(--border)',
                    background: aceptado
                      ? capActual.color + '11' : 'var(--bg3)',
                  }}
                >
                  <div style={styles.consejoHeader}>
                    <h3 style={styles.consejoTitulo}>{consejo.titulo}</h3>
                    <span style={{ ...styles.consejoXp,
                      color: capActual.color }}>
                      +{consejo.xp} XP
                    </span>
                  </div>

                  <p style={styles.consejoTexto}>{consejo.texto}</p>

                  <div style={{
                    ...styles.misionWrap,
                    borderColor: capActual.color + '44',
                  }}>
                    <span style={{ fontSize: '14px' }}>⚔️</span>
                    <p style={styles.misionTexto}>
                      <strong style={{ color: capActual.color }}>
                        Misión:
                      </strong>{' '}
                      {consejo.mision}
                    </p>
                    <button
                      style={{
                        ...styles.btnMision,
                        background: aceptado
                          ? capActual.color : 'transparent',
                        color: aceptado
                          ? 'var(--bg)' : capActual.color,
                        border: `1px solid ${capActual.color}`,
                      }}
                      onClick={() => toggleMision(consejo.id)}
                    >
                      {aceptado ? '✓ Aceptada' : 'Aceptar'}
                    </button>
                  </div>
                </div>
              )
            })}
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
  xpBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--bg2)',
    border: '1px solid var(--gold-dim)',
    borderRadius: '4px',
    padding: '12px 16px',
  },
  xpBannerTexto: {
    fontFamily: 'Crimson Text, serif',
    fontSize: '14px',
    color: 'var(--silver-300)',
  },
  contenido: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    gap: '16px',
    alignItems: 'start',
  },
  indice: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  indiceTitulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  indiceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    borderRadius: '3px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
  },
  capitulo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  capituloHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '16px 20px',
  },
  capituloTitulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '0.04em',
  },
  capituloSub: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    marginTop: '3px',
  },
  consejosLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  consejo: {
    border: '1px solid',
    borderRadius: '4px',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'all 0.2s ease',
  },
  consejoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consejoTitulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '14px',
    color: 'var(--silver-100)',
    fontWeight: '600',
  },
  consejoXp: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    fontWeight: '600',
  },
  consejoTexto: {
    fontFamily: 'Crimson Text, serif',
    fontSize: '14px',
    color: 'var(--silver-300)',
    lineHeight: '1.6',
    fontStyle: 'italic',
  },
  misionWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--bg4)',
    border: '1px solid',
    borderRadius: '3px',
    padding: '10px 14px',
  },
  misionTexto: {
    flex: 1,
    fontFamily: 'Crimson Text, serif',
    fontSize: '13px',
    color: 'var(--silver-300)',
  },
  btnMision: {
    fontFamily: 'Cinzel, serif',
    fontSize: '11px',
    borderRadius: '3px',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
    letterSpacing: '0.03em',
  },
}

export default ManualPage