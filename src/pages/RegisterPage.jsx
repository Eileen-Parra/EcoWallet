import { useState } from 'react'

const CATEGORIAS = [
  { id: 'comida',     nombre: 'Comida',     emoji: '🍖', color: 'var(--cat-food)'      },
  { id: 'transporte', nombre: 'Transporte',  emoji: '🚌', color: 'var(--cat-transport)' },
  { id: 'ropa',       nombre: 'Ropa',        emoji: '👕', color: 'var(--cat-clothes)'   },
  { id: 'tech',       nombre: 'Tecnología',  emoji: '💻', color: 'var(--cat-tech)'      },
  { id: 'otros',      nombre: 'Otros',       emoji: '📦', color: 'var(--cat-other)'     },
]

const CO2_POR_CAT = {
  comida: 0.8, transporte: 0.5, ropa: 1.2, tech: 0.3, otros: 0.4,
}

function fmt(n) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

function RegisterPage({ heroe, onGuardar, onNavegar }) {
  const [producto, setProducto]     = useState('')
  const [precio, setPrecio]         = useState('')
  const [categoria, setCategoria]   = useState('comida')
  const [fecha, setFecha]           = useState(
    new Date().toISOString().split('T')[0]
  )
  const [guardado, setGuardado]     = useState(false)
  const [xpGanada, setXpGanada]     = useState(0)
  const [particulas, setParticulas] = useState([])

  const catActual        = CATEGORIAS.find(c => c.id === categoria)
  const precioNum        = parseFloat(precio) || 0
  const co2Est           = ((precioNum / 10000) * (CO2_POR_CAT[categoria] || 0.4)).toFixed(2)
  const formularioValido = producto.trim() && precioNum > 0

  function handleGuardar() {
    if (!formularioValido) return

    const nuevoGasto = {
      id:        Date.now(),
      producto:  producto.trim(),
      precio:    precioNum,
      categoria,
      fecha,
      co2:       parseFloat(co2Est),
    }

    const xpGanada = onGuardar(nuevoGasto)
    const xp = typeof xpGanada === 'number'
      ? xpGanada
      : Math.floor(precioNum / 5000) + 10

    setXpGanada(xp)
    setGuardado(true)

    const nuevasParticulas = Array.from({ length: 5 }).map((_, i) => ({
      id:    Date.now() + i,
      x:     40 + Math.random() * 20,
      delay: i * 100,
    }))
    setParticulas(nuevasParticulas)
    setTimeout(() => setParticulas([]), 2000)

    setTimeout(() => {
      setProducto('')
      setPrecio('')
      setCategoria('comida')
      setFecha(new Date().toISOString().split('T')[0])
      setGuardado(false)
      setXpGanada(0)
    }, 2000)
  }

  return (
    <div style={styles.contenedor}>

      {/* CABECERA */}
      <div style={styles.cabecera}>
        <div>
          <p style={styles.sobre}>— La Armería —</p>
          <h1 style={styles.titulo}>Registrar Gasto</h1>
        </div>
        <button style={styles.btnVolver} onClick={() => onNavegar('mapa')}>
          🗺️ Volver al mapa
        </button>
      </div>

      <div style={styles.lineaDivisora} />

      <div style={styles.contenido}>

        {/* FORMULARIO */}
        <div style={styles.card}>
          <p style={styles.cardTitulo}>⚔️ Nuevo registro</p>

          {/* NOMBRE */}
          <div style={styles.grupo}>
            <label style={styles.label}>Nombre del gasto</label>
            <input
              style={styles.input}
              placeholder="Ej: Almuerzo, Bus, Camiseta..."
              value={producto}
              maxLength={40}
              onChange={e => setProducto(e.target.value)}
              autoFocus
            />
          </div>

          {/* Precio */}
          <div style={styles.grupo}>
            <label style={styles.label}>Precio (COP)</label>
            <div style={styles.precioWrap}>
              <span style={styles.precioSigno}>$</span>
              <input
                style={styles.precioInput}
                type="number"
                placeholder="0"
                value={precio}
                min="0"
                onChange={e => setPrecio(e.target.value)}
              />
            </div>
          </div>

          {/* Fecha */}
          <div style={styles.grupo}>
            <label style={styles.label}>Fecha</label>
            <input
              style={styles.input}
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
            />
          </div>

          {/* Categoría */}
          <div style={styles.grupo}>
            <label style={styles.label}>Categoría</label>
            <div style={styles.catGrid}>
              {CATEGORIAS.map(cat => (
                <button
                  key={cat.id}
                  style={{
                    ...styles.catBtn,
                    background: categoria === cat.id
                      ? 'var(--bg4)' : 'var(--bg3)',
                    border: categoria === cat.id
                      ? `1px solid ${cat.color}`
                      : '1px solid var(--border)',
                    transform: categoria === cat.id
                      ? 'scale(1.05)' : 'scale(1)',
                  }}
                  onClick={() => setCategoria(cat.id)}
                >
                  <span style={{ fontSize: '22px' }}>{cat.emoji}</span>
                  <span style={{
                    fontSize: '11px',
                    color: categoria === cat.id
                      ? cat.color : 'var(--text-secondary)',
                    fontFamily: 'Cinzel, serif',
                  }}>
                    {cat.nombre}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CO2 */}
          {precioNum > 0 && (
            <div style={{
              ...styles.previewCO2,
              borderColor: catActual.color,
            }}>
              <div style={styles.previewFila}>
                <span style={styles.previewLabel}>Categoría</span>
                <span style={{ color: catActual.color,
                  fontFamily: 'Cinzel, serif', fontSize: '13px' }}>
                  {catActual.emoji} {catActual.nombre}
                </span>
              </div>
              <div style={styles.previewFila}>
                <span style={styles.previewLabel}>Precio</span>
                <span style={styles.previewValor}>{fmt(precioNum)}</span>
              </div>
              <div style={styles.previewFila}>
                <span style={styles.previewLabel}>Huella CO₂ estimada</span>
                <span style={{ ...styles.previewValor,
                  color: 'var(--cat-tech)' }}>
                  {co2Est} kg
                </span>
              </div>
            </div>
          )}

          {/* gUARDAR */}
          <button
            style={{
              ...styles.btnGuardar,
              opacity:    formularioValido ? 1 : 0.4,
              cursor:     formularioValido ? 'pointer' : 'not-allowed',
              background: guardado
                ? 'var(--cat-tech)' : 'var(--silver-200)',
            }}
            onClick={handleGuardar}
            disabled={!formularioValido}
          >
            {guardado
              ? `✓ ¡Registrado! +${xpGanada} XP`
              : '⚔️ Registrar en los pergaminos'}
          </button>
        </div>

        {/* PANEL DERECHO */}
        <div style={styles.panelDerecho}>

          {/* CONSEJO */}
          <div style={styles.card}>
            <p style={styles.cardTitulo}>📖 Sabiduría del Grimorio</p>
            <div style={styles.consejo}>
              <span style={{ fontSize: '28px' }}>{catActual.emoji}</span>
              <p style={styles.consejoTexto}>{consejos[categoria]}</p>
            </div>
          </div>

          {/* Impacto ambiental */}
          <div style={styles.card}>
            <p style={styles.cardTitulo}>☁️ Impacto ambiental</p>
            <div style={styles.impactoWrap}>
              {CATEGORIAS.map(cat => (
                <div key={cat.id} style={styles.impactoFila}>
                  <span style={{ fontSize: '14px', width: '20px' }}>
                    {cat.emoji}
                  </span>
                  <div style={styles.impactoBarraFondo}>
                    <div style={{
                      ...styles.impactoBarraRelleno,
                      width: `${(CO2_POR_CAT[cat.id] / 1.2) * 100}%`,
                      background: cat.id === categoria
                        ? cat.color : 'var(--border2)',
                    }} />
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: cat.id === categoria
                      ? cat.color : 'var(--text-muted)',
                    fontFamily: 'Cinzel, serif',
                    width: '36px',
                    textAlign: 'right',
                  }}>
                    {CO2_POR_CAT[cat.id]}
                  </span>
                </div>
              ))}
              <p style={{ fontSize: '10px', color: 'var(--text-muted)',
                fontStyle: 'italic', marginTop: '6px' }}>
                kg CO₂ por cada $10.000 gastados
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Particulas de XP */}
      {particulas.map(p => (
        <div
          key={p.id}
          style={{
            position:     'fixed',
            left:         `${p.x}%`,
            bottom:       '30%',
            fontFamily:   'Cinzel, serif',
            fontSize:     '14px',
            fontWeight:   '700',
            color:        'var(--gold)',
            pointerEvents: 'none',
            zIndex:       100,
            animation:    `xpFlotante 1.8s ease forwards`,
            animationDelay: `${p.delay}ms`,
            opacity:      0,
            textShadow:   '0 0 10px rgba(201,168,76,0.8)',
          }}
        >
          +{Math.ceil(xpGanada / 5)} XP
        </div>
      ))}

      <style>{`
        @keyframes aparecer {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes xpFlotante {
          0%   { opacity: 0;   transform: translateY(0px)    scale(0.8); }
          20%  { opacity: 1;   transform: translateY(-20px)  scale(1.1); }
          80%  { opacity: 1;   transform: translateY(-80px)  scale(1);   }
          100% { opacity: 0;   transform: translateY(-120px) scale(0.9); }
        }
      `}</style>
    </div>
  )
}

const consejos = {
  comida:     'Cocinar en casa puede reducir hasta 2 kg de CO₂ al mes vs pedir delivery. Tu reino y tu bolsillo lo agradecerán.',
  transporte: 'El transporte público genera 4× menos CO₂ que el auto particular. Cada viaje en bus es una victoria para el reino.',
  ropa:       'Comprar ropa de segunda mano reduce un 70% el impacto ambiental. Los mejores guerreros reutilizan su armadura.',
  tech:       'Reparar un dispositivo en vez de comprar uno nuevo ahorra hasta 80 kg de CO₂. El sabio cuida sus herramientas.',
  otros:      'Antes de comprar pregúntate: ¿lo necesito o lo deseo? La templanza es la virtud del verdadero guardián.',
}

const styles = {
  contenedor: {
    minHeight:      '100vh',
    background:     'var(--bg)',
    padding:        '28px 32px',
    display:        'flex',
    flexDirection:  'column',
    gap:            '20px',
    animation:      'aparecer 0.5s ease',
  },
  cabecera: {
    display:        'flex',
    alignItems:     'flex-start',
    justifyContent: 'space-between',
  },
  sobre: {
    fontFamily:  'Crimson Text, serif',
    fontStyle:   'italic',
    fontSize:    '13px',
    color:       'var(--text-secondary)',
    marginBottom: '4px',
  },
  titulo: {
    fontFamily:     'Cinzel, serif',
    fontSize:       '26px',
    fontWeight:     '700',
    color:          'var(--silver-100)',
    letterSpacing:  '0.05em',
  },
  btnVolver: {
    fontFamily:    'Cinzel, serif',
    fontSize:      '12px',
    color:         'var(--text-secondary)',
    background:    'none',
    border:        '1px solid var(--border)',
    borderRadius:  '3px',
    padding:       '8px 14px',
    cursor:        'pointer',
  },
  lineaDivisora: {
    height:     '1px',
    background: 'linear-gradient(90deg, var(--gold), transparent)',
  },
  contenido: {
    display:               'grid',
    gridTemplateColumns:   '1.2fr 1fr',
    gap:                   '16px',
    alignItems:            'start',
  },
  card: {
    background:     'var(--bg2)',
    border:         '1px solid var(--border)',
    borderRadius:   '4px',
    padding:        '20px',
    display:        'flex',
    flexDirection:  'column',
    gap:            '16px',
  },
  cardTitulo: {
    fontFamily:    'Cinzel, serif',
    fontSize:      '12px',
    color:         'var(--silver-200)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  grupo: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '6px',
  },
  label: {
    fontFamily:    'Cinzel, serif',
    fontSize:      '10px',
    color:         'var(--text-secondary)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  input: {
    background:   'var(--bg3)',
    border:       '1px solid var(--border)',
    borderRadius: '3px',
    padding:      '10px 14px',
    fontSize:     '14px',
    fontFamily:   'Crimson Text, serif',
    color:        'var(--silver-100)',
    outline:      'none',
  },
  precioWrap: {
    display:      'flex',
    alignItems:   'center',
    background:   'var(--bg3)',
    border:       '1px solid var(--border)',
    borderRadius: '3px',
    padding:      '10px 14px',
    gap:          '6px',
  },
  precioSigno: {
    fontFamily: 'Cinzel, serif',
    fontSize:   '14px',
    color:      'var(--text-muted)',
  },
  precioInput: {
    background: 'none',
    border:     'none',
    outline:    'none',
    fontSize:   '14px',
    fontFamily: 'Crimson Text, serif',
    color:      'var(--silver-100)',
    width:      '100%',
  },
  catGrid: {
    display:             'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap:                 '8px',
  },
  catBtn: {
    borderRadius:  '4px',
    padding:       '10px 4px',
    cursor:        'pointer',
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    gap:           '5px',
    transition:    'all 0.2s ease',
  },
  previewCO2: {
    background:    'var(--bg3)',
    border:        '1px solid',
    borderRadius:  '4px',
    padding:       '14px',
    display:       'flex',
    flexDirection: 'column',
    gap:           '8px',
    transition:    'border-color 0.3s ease',
  },
  previewFila: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  previewLabel: {
    fontSize:   '11px',
    color:      'var(--text-muted)',
    fontStyle:  'italic',
    fontFamily: 'Crimson Text, serif',
  },
  previewValor: {
    fontFamily: 'Cinzel, serif',
    fontSize:   '13px',
    color:      'var(--silver-200)',
  },
  btnGuardar: {
    fontFamily:    'Cinzel, serif',
    fontSize:      '13px',
    fontWeight:    '600',
    letterSpacing: '0.05em',
    color:         'var(--bg)',
    border:        'none',
    borderRadius:  '3px',
    padding:       '13px',
    transition:    'all 0.3s ease',
    marginTop:     '4px',
  },
  panelDerecho: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '16px',
  },
  consejo: {
    display:    'flex',
    gap:        '12px',
    alignItems: 'flex-start',
  },
  consejoTexto: {
    fontFamily: 'Crimson Text, serif',
    fontSize:   '14px',
    fontStyle:  'italic',
    color:      'var(--silver-300)',
    lineHeight: '1.6',
  },
  impactoWrap: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '8px',
  },
  impactoFila: {
    display:    'flex',
    alignItems: 'center',
    gap:        '8px',
  },
  impactoBarraFondo: {
    flex:         1,
    height:       '4px',
    background:   'var(--bg4)',
    borderRadius: '2px',
    overflow:     'hidden',
  },
  impactoBarraRelleno: {
    height:       '100%',
    borderRadius: '2px',
    transition:   'all 0.3s ease',
  },
}

export default RegisterPage