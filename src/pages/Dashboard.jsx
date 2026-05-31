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

function calcularCO2(precio, categoria) {
  return ((precio / 10000) * (CO2_POR_CAT[categoria] || 0.4)).toFixed(2)
}

function Dashboard({ heroe, gastos, onNavegar }) {
  const totalGastado = gastos.reduce((sum, g) => sum + g.precio, 0)
  const totalCO2 = gastos.reduce((sum, g) =>
    sum + parseFloat(calcularCO2(g.precio, g.categoria)), 0
  )

  const porCategoria = CATEGORIAS.map(cat => {
    const total = gastos
      .filter(g => g.categoria === cat.id)
      .reduce((sum, g) => sum + g.precio, 0)
    const co2 = gastos
      .filter(g => g.categoria === cat.id)
      .reduce((sum, g) => sum + parseFloat(calcularCO2(g.precio, g.categoria)), 0)
    return { ...cat, total, co2 }
  }).filter(c => c.total > 0)

  const maxTotal = Math.max(...porCategoria.map(c => c.total), 1)

  return (
    <div style={styles.contenedor}>

      

      <div style={styles.cabecera}>
        <div>
          <p style={styles.sobre}>— El Castillo —</p>
          <h1 style={styles.titulo}>Tu Reino, {heroe.nombre}</h1>
        </div>
        <button style={styles.btnMapa} onClick={() => onNavegar('mapa')}>
          🗺️ Volver al mapa
        </button>
      </div>

      <div style={styles.lineaDivisora} />

      {/* Métricas */}
      
      <div style={styles.metricas}>
        <div style={{ ...styles.metrica, borderTopColor: 'var(--silver-300)' }}>
          <p style={styles.metricaLabel}>⚔️ Tesoro gastado</p>
          <p style={styles.metricaValor}>{fmt(totalGastado)}</p>
          <p style={styles.metricaSub}>Este ciclo lunar</p>
        </div>
        <div style={{ ...styles.metrica, borderTopColor: 'var(--cat-tech)' }}>
          <p style={styles.metricaLabel}>☁️ Huella CO₂</p>
          <p style={{ ...styles.metricaValor, color: 'var(--cat-tech)' }}>
            {totalCO2.toFixed(1)} kg
          </p>
          <p style={styles.metricaSub}>Este ciclo lunar</p>
        </div>
        <div style={{ ...styles.metrica, borderTopColor: 'var(--gold)' }}>
          <p style={styles.metricaLabel}>📅 Promedio diario</p>
          <p style={{ ...styles.metricaValor, color: 'var(--gold)' }}>
            {gastos.length > 0 ? fmt(totalGastado / 30) : '$0'}
          </p>
          <p style={styles.metricaSub}>Este ciclo lunar</p>
        </div>
        <div style={{ ...styles.metrica, borderTopColor: 'var(--cat-food)' }}>
          <p style={styles.metricaLabel}>🏆 Nivel ecológico</p>
          <p style={{ ...styles.metricaValor, fontSize: '16px',
            color: 'var(--cat-tech)', marginTop: '6px' }}>
            {totalCO2 === 0 ? 'Sin datos' : totalCO2 < 5
              ? 'Guardián Eco' : totalCO2 < 15
              ? 'Aprendiz' : 'Contaminador'}
          </p>
          <p style={{ ...styles.metricaSub, color: 'var(--cat-tech)' }}>
            {totalCO2 === 0
              ? 'Registra tus gastos'
              : '¡Vas por buen camino!'}
          </p>
        </div>
      </div>

      {/* Fila principal */}

      <div style={styles.fila}>

        {/* Categorías de gastos */}
        <div style={styles.card}>
          <p style={styles.cardTitulo}>💰 Gastos por categoría</p>
          {porCategoria.length === 0 ? (
            <div style={styles.vacio}>
              <span style={{ fontSize: '32px' }}>💰</span>
              <p style={styles.vacioTitulo}>Sin categorías aún</p>
              <p style={styles.vacioSub}>
                Tus gastos aparecerán aquí agrupados.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {porCategoria.map(cat => (
                <div key={cat.id}>
                  <div style={styles.catFila}>
                    <span style={styles.catEmoji}>{cat.emoji}</span>
                    <span style={styles.catNombre}>{cat.nombre}</span>
                    <span style={{ ...styles.catValor, color: cat.color }}>
                      {fmt(cat.total)}
                    </span>
                    <span style={styles.catCO2}>{cat.co2.toFixed(1)} kg</span>
                  </div>
                  <div style={styles.barraFondo}>
                    <div style={{
                      ...styles.barraRelleno,
                      width: `${(cat.total / maxTotal) * 100}%`,
                      background: cat.color,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gastos recientes */}

        <div style={styles.card}>
          <div style={styles.cardCabecera}>
            <p style={styles.cardTitulo}>🕒 Últimos pergaminos</p>
            <button
              style={styles.btnVer}
              onClick={() => onNavegar('pergaminos')}
            >
              Ver todos →
            </button>
          </div>
          {gastos.length === 0 ? (
            <div style={styles.vacio}>
              <span style={{ fontSize: '32px' }}>📜</span>
              <p style={styles.vacioTitulo}>Sin registros aún</p>
              <p style={styles.vacioSub}>
                Tu historia está por escribirse, {heroe.nombre}.
              </p>
              <button
                style={styles.btnRegistrar}
                onClick={() => onNavegar('registrar')}
              >
                ⚔️ Registrar primer gasto
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {gastos.slice(0, 5).map(g => {
                const cat = CATEGORIAS.find(c => c.id === g.categoria)
                return (
                  <div key={g.id} style={styles.gastoFila}>
                    <span style={{ fontSize: '18px' }}>{cat?.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={styles.gastoNombre}>{g.producto}</p>
                      <p style={styles.gastoFecha}>{g.fecha}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ ...styles.gastoPrecio, color: cat?.color }}>
                        {fmt(g.precio)}
                      </p>
                      <p style={styles.gastoCO2}>
                        {calcularCO2(g.precio, g.categoria)} kg CO₂
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Accesos */}
      <div style={styles.accesos}>
        {[
          { id: 'registrar', emoji: '⚔️', label: 'Registrar gasto' },
          { id: 'stats',     emoji: '📊', label: 'Estadísticas'    },
          { id: 'manual',    emoji: '📖', label: 'El Grimorio'     },
          { id: 'forja',     emoji: '⚙️', label: 'La Forja'        },
        ].map(a => (
          <button
            key={a.id}
            style={styles.acceso}
            onClick={() => onNavegar(a.id)}
          >
            <span style={{ fontSize: '22px' }}>{a.emoji}</span>
            <span style={styles.accesoLabel}>{a.label}</span>
          </button>
        ))}
      </div>

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
  btnMapa: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    background: 'none',
    border: '1px solid var(--border)',
    borderRadius: '3px',
    padding: '8px 14px',
    cursor: 'pointer',
    letterSpacing: '0.03em',
  },
  lineaDivisora: {
    height: '1px',
    background: 'linear-gradient(90deg, var(--gold), transparent)',
    marginBottom: '4px',
  },
  metricas: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  metrica: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderTop: '2px solid',
    borderRadius: '4px',
    padding: '16px',
  },
  metricaLabel: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontFamily: 'Cinzel, serif',
    letterSpacing: '0.04em',
    marginBottom: '8px',
  },
  metricaValor: {
    fontFamily: 'Cinzel, serif',
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--silver-100)',
  },
  metricaSub: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    marginTop: '4px',
  },
  fila: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  card: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardCabecera: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    color: 'var(--silver-200)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  btnVer: {
    fontFamily: 'Crimson Text, serif',
    fontSize: '13px',
    color: 'var(--gold)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontStyle: 'italic',
  },
  catFila: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '5px',
  },
  catEmoji: {
    fontSize: '16px',
    width: '20px',
  },
  catNombre: {
    flex: 1,
    fontSize: '13px',
    color: 'var(--silver-200)',
    fontFamily: 'Crimson Text, serif',
  },
  catValor: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
  },
  catCO2: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    width: '52px',
    textAlign: 'right',
  },
  barraFondo: {
    height: '3px',
    background: 'var(--bg4)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  barraRelleno: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.6s ease',
  },
  gastoFila: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
    borderBottom: '1px solid var(--border)',
  },
  gastoNombre: {
    fontSize: '13px',
    color: 'var(--silver-200)',
    fontFamily: 'Crimson Text, serif',
  },
  gastoFecha: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    marginTop: '2px',
  },
  gastoPrecio: {
    fontFamily: 'Cinzel, serif',
    fontSize: '13px',
  },
  gastoCO2: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    marginTop: '2px',
  },
  vacio: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '24px 0',
    textAlign: 'center',
  },
  vacioTitulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '14px',
    color: 'var(--silver-300)',
  },
  vacioSub: {
    fontSize: '13px',
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
    letterSpacing: '0.03em',
  },
  accesos: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  },
  acceso: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.2s ease',
  },
  accesoLabel: {
    fontFamily: 'Cinzel, serif',
    fontSize: '11px',
    color: 'var(--silver-200)',
    letterSpacing: '0.03em',
  },
}

export default Dashboard