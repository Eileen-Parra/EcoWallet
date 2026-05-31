import { useState } from 'react'

const CATEGORIAS = [
  { id: 'todos',      nombre: 'Todos',      emoji: '📜', color: 'var(--silver-300)'   },
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

function calcularCO2(precio, categoria) {
  return ((precio / 10000) * (CO2_POR_CAT[categoria] || 0.4)).toFixed(2)
}

function ScrollsPage({ heroe, gastos, onEliminar, onNavegar }) {
  const [filtro, setFiltro]       = useState('todos')
  const [confirmar, setConfirmar] = useState(null)
  const [orden, setOrden]         = useState('reciente')

  const gastosFiltrados = gastos
    .filter(g => filtro === 'todos' || g.categoria === filtro)
    .sort((a, b) => {
      if (orden === 'reciente')  return new Date(b.fecha) - new Date(a.fecha)
      if (orden === 'antiguo')   return new Date(a.fecha) - new Date(b.fecha)
      if (orden === 'mayor')     return b.precio - a.precio
      if (orden === 'menor')     return a.precio - b.precio
      return 0
    })

  const totalFiltrado = gastosFiltrados.reduce((s, g) => s + g.precio, 0)
  const co2Filtrado   = gastosFiltrados.reduce(
    (s, g) => s + parseFloat(calcularCO2(g.precio, g.categoria)), 0
  )

  function handleEliminar(id) {
    if (confirmar === id) {
      onEliminar(id)
      setConfirmar(null)
    } else {
      setConfirmar(id)
      setTimeout(() => setConfirmar(null), 3000)
    }
  }

  const catActual = CATEGORIAS.find(c => c.id === filtro)

  return (
    <div style={styles.contenedor}>

      {/* CABECERA */}
      <div style={styles.cabecera}>
        <div>
          <p style={styles.sobre}>— La Biblioteca —</p>
          <h1 style={styles.titulo}>Mis Pergaminos</h1>
        </div>
        <div style={styles.cabeceraAcciones}>
          <button
            style={styles.btnAccion}
            onClick={() => onNavegar('registrar')}
          >
            ⚔️ Nuevo registro
          </button>
          <button style={styles.btnVolver} onClick={() => onNavegar('mapa')}>
            🗺️ Volver al mapa
          </button>
        </div>
      </div>

      <div style={styles.lineaDivisora} />

      {/* RESUMEN */}
      <div style={styles.resumen}>
        <div style={styles.resumenItem}>
          <p style={styles.resumenLabel}>📜 Registros</p>
          <p style={styles.resumenValor}>{gastosFiltrados.length}</p>
        </div>
        <div style={styles.resumenItem}>
          <p style={styles.resumenLabel}>💰 Total</p>
          <p style={styles.resumenValor}>{fmt(totalFiltrado)}</p>
        </div>
        <div style={styles.resumenItem}>
          <p style={styles.resumenLabel}>☁️ CO₂ total</p>
          <p style={{ ...styles.resumenValor, color: 'var(--cat-tech)' }}>
            {co2Filtrado.toFixed(1)} kg
          </p>
        </div>
        <div style={styles.resumenItem}>
          <p style={styles.resumenLabel}>📂 Filtro activo</p>
          <p style={{ ...styles.resumenValor, color: catActual.color,
            fontSize: '14px' }}>
            {catActual.emoji} {catActual.nombre}
          </p>
        </div>
      </div>

      {/* FILTROS Y ORDEN */}
      <div style={styles.controles}>
        <div style={styles.filtros}>
          {CATEGORIAS.map(cat => (
            <button
              key={cat.id}
              style={{
                ...styles.filtroBtn,
                background:  filtro === cat.id ? 'var(--bg3)' : 'transparent',
                border:      filtro === cat.id
                  ? `1px solid ${cat.color}`
                  : '1px solid var(--border)',
                color: filtro === cat.id ? cat.color : 'var(--text-secondary)',
              }}
              onClick={() => setFiltro(cat.id)}
            >
              {cat.emoji} {cat.nombre}
            </button>
          ))}
        </div>
        <select
          style={styles.select}
          value={orden}
          onChange={e => setOrden(e.target.value)}
        >
          <option value="reciente">Más reciente</option>
          <option value="antiguo">Más antiguo</option>
          <option value="mayor">Mayor precio</option>
          <option value="menor">Menor precio</option>
        </select>
      </div>

      {/* LISTA DE GASTOS */}
      {gastosFiltrados.length === 0 ? (
        <div style={styles.vacio}>
          <span style={{ fontSize: '40px' }}>📜</span>
          <p style={styles.vacioTitulo}>
            {gastos.length === 0
              ? 'Tus pergaminos están en blanco'
              : 'Sin registros en esta categoría'}
          </p>
          <p style={styles.vacioSub}>
            {gastos.length === 0
              ? `Comienza tu historia, ${heroe.nombre}.`
              : 'Prueba con otro filtro.'}
          </p>
          {gastos.length === 0 && (
            <button
              style={styles.btnRegistrar}
              onClick={() => onNavegar('registrar')}
            >
              ⚔️ Registrar primer gasto
            </button>
          )}
        </div>
      ) : (
        <div style={styles.lista}>
          {gastosFiltrados.map(g => {
            const cat = CATEGORIAS.find(c => c.id === g.categoria)
            const co2 = calcularCO2(g.precio, g.categoria)
            const estaConfirmando = confirmar === g.id

            return (
              <div
                key={g.id}
                style={{
                  ...styles.gastoItem,
                  borderColor: estaConfirmando
                    ? 'var(--cat-food)'
                    : 'var(--border)',
                }}
              >
                {/* ICONO */}
                <div style={{
                  ...styles.gastoIcono,
                  background: cat?.color + '22',
                  border: `1px solid ${cat?.color}`,
                }}>
                  <span style={{ fontSize: '20px' }}>{cat?.emoji}</span>
                </div>

                {/* INFO */}
                <div style={styles.gastoInfo}>
                  <p style={styles.gastoNombre}>{g.producto}</p>
                  <p style={styles.gastoMeta}>
                    <span style={{ color: cat?.color }}>{cat?.nombre}</span>
                    <span style={{ color: 'var(--text-muted)' }}>·</span>
                    <span>{g.fecha}</span>
                    <span style={{ color: 'var(--text-muted)' }}>·</span>
                    <span style={{ color: 'var(--cat-tech)' }}>{co2} kg CO₂</span>
                  </p>
                </div>

                {/* PRECIO */}
                <div style={styles.gastoPrecioWrap}>
                  <p style={{ ...styles.gastoPrecio, color: cat?.color }}>
                    {fmt(g.precio)}
                  </p>
                </div>

                {/* BOTON ELIMINAR */}
                <button
                  style={{
                    ...styles.btnEliminar,
                    background:  estaConfirmando ? 'var(--cat-food)' : 'transparent',
                    color:       estaConfirmando ? '#fff' : 'var(--text-muted)',
                    border:      estaConfirmando
                      ? '1px solid var(--cat-food)'
                      : '1px solid var(--border)',
                  }}
                  onClick={() => handleEliminar(g.id)}
                >
                  {estaConfirmando ? '¿Confirmar?' : '✕'}
                </button>
              </div>
            )
          })}
        </div>
      )}

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
  cabeceraAcciones: {
    display: 'flex',
    gap: '10px',
  },
  btnAccion: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    color: 'var(--bg)',
    background: 'var(--silver-200)',
    border: 'none',
    borderRadius: '3px',
    padding: '8px 14px',
    cursor: 'pointer',
    letterSpacing: '0.03em',
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
  resumen: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  resumenItem: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '14px 16px',
  },
  resumenLabel: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontFamily: 'Cinzel, serif',
    letterSpacing: '0.04em',
    marginBottom: '6px',
    textTransform: 'uppercase',
  },
  resumenValor: {
    fontFamily: 'Cinzel, serif',
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--silver-100)',
  },
  controles: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filtros: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filtroBtn: {
    fontFamily: 'Cinzel, serif',
    fontSize: '11px',
    borderRadius: '3px',
    padding: '6px 12px',
    cursor: 'pointer',
    letterSpacing: '0.03em',
    transition: 'all 0.2s ease',
  },
  select: {
    fontFamily: 'Cinzel, serif',
    fontSize: '11px',
    color: 'var(--silver-200)',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '3px',
    padding: '6px 12px',
    cursor: 'pointer',
    outline: 'none',
  },
  vacio: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '60px 0',
    textAlign: 'center',
  },
  vacioTitulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '16px',
    color: 'var(--silver-300)',
  },
  vacioSub: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    fontFamily: 'Crimson Text, serif',
  },
  btnRegistrar: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    color: 'var(--bg)',
    background: 'var(--silver-200)',
    border: 'none',
    borderRadius: '3px',
    padding: '10px 20px',
    cursor: 'pointer',
    marginTop: '6px',
  },
  lista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  gastoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'var(--bg2)',
    border: '1px solid',
    borderRadius: '4px',
    padding: '14px 16px',
    transition: 'border-color 0.2s ease',
  },
  gastoIcono: {
    width: '40px',
    height: '40px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  gastoInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  gastoNombre: {
    fontFamily: 'Crimson Text, serif',
    fontSize: '15px',
    color: 'var(--silver-100)',
    fontWeight: '600',
  },
  gastoMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    fontFamily: 'Crimson Text, serif',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
  },
  gastoPrecioWrap: {
    textAlign: 'right',
  },
  gastoPrecio: {
    fontFamily: 'Cinzel, serif',
    fontSize: '15px',
    fontWeight: '600',
  },
  btnEliminar: {
    fontFamily: 'Cinzel, serif',
    fontSize: '11px',
    borderRadius: '3px',
    padding: '6px 10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
}

export default ScrollsPage