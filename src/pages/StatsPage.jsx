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

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function fmt(n) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

function calcularCO2(precio, categoria) {
  return ((precio / 10000) * (CO2_POR_CAT[categoria] || 0.4))
}

function StatsPage({ heroe, gastos, onNavegar }) {
  const totalGastado = gastos.reduce((s, g) => s + g.precio, 0)
  const totalCO2     = gastos.reduce((s, g) => s + calcularCO2(g.precio, g.categoria), 0)

  // Gastos y CO2 por categoría
  const porCategoria = CATEGORIAS.map(cat => {
    const total = gastos
      .filter(g => g.categoria === cat.id)
      .reduce((s, g) => s + g.precio, 0)
    const co2 = gastos
      .filter(g => g.categoria === cat.id)
      .reduce((s, g) => s + calcularCO2(g.precio, g.categoria), 0)
    const porcentaje = totalGastado > 0
      ? Math.round((total / totalGastado) * 100)
      : 0
    return { ...cat, total, co2, porcentaje }
  }).filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)

  // Últimos 7 días
  const hoy       = new Date()
  const ultimos7  = Array.from({ length: 7 }).map((_, i) => {
    const fecha = new Date(hoy)
    fecha.setDate(hoy.getDate() - (6 - i))
    const fechaStr = fecha.toISOString().split('T')[0]
    const gastosDelDia = gastos.filter(g => g.fecha === fechaStr)
    const total = gastosDelDia.reduce((s, g) => s + g.precio, 0)
    const co2   = gastosDelDia.reduce((s, g) => s + calcularCO2(g.precio, g.categoria), 0)
    return {
      dia:    DIAS[fecha.getDay()],
      fecha:  fechaStr,
      total,
      co2,
    }
  })

  const maxDia = Math.max(...ultimos7.map(d => d.total), 1)
  const maxCO2 = Math.max(...ultimos7.map(d => d.co2), 1)

  // Gasto más alto
  const gastoMayor = gastos.reduce(
    (max, g) => g.precio > (max?.precio || 0) ? g : max, null
  )

  // Categoría más usada
  const catMasUsada = porCategoria[0] || null

  return (
    <div style={styles.contenedor}>

      {/* CABECERA */}
      <div style={styles.cabecera}>
        <div>
          <p style={styles.sobre}>— El Observatorio —</p>
          <h1 style={styles.titulo}>Estadísticas del Reino</h1>
        </div>
        <button style={styles.btnVolver} onClick={() => onNavegar('mapa')}>
          🗺️ Volver al mapa
        </button>
      </div>

      <div style={styles.lineaDivisora} />

      {gastos.length === 0 ? (
        <div style={styles.vacio}>
          <span style={{ fontSize: '48px' }}>🔭</span>
          <p style={styles.vacioTitulo}>El observatorio está oscuro</p>
          <p style={styles.vacioSub}>
            Registra tus gastos para ver las estrellas, {heroe.nombre}.
          </p>
          <button
            style={styles.btnRegistrar}
            onClick={() => onNavegar('registrar')}
          >
            ⚔️ Registrar primer gasto
          </button>
        </div>
      ) : (
        <>
          {/* METRICAS CLAVE */}
          <div style={styles.metricas}>
            <div style={{ ...styles.metrica, borderTopColor: 'var(--silver-300)' }}>
              <p style={styles.metricaLabel}>💰 Total gastado</p>
              <p style={styles.metricaValor}>{fmt(totalGastado)}</p>
              <p style={styles.metricaSub}>{gastos.length} registros</p>
            </div>
            <div style={{ ...styles.metrica, borderTopColor: 'var(--cat-tech)' }}>
              <p style={styles.metricaLabel}>☁️ CO₂ total</p>
              <p style={{ ...styles.metricaValor, color: 'var(--cat-tech)' }}>
                {totalCO2.toFixed(1)} kg
              </p>
              <p style={styles.metricaSub}>
                ≈ {(totalCO2 / 0.12).toFixed(0)} km en auto
              </p>
            </div>
            <div style={{ ...styles.metrica, borderTopColor: 'var(--cat-food)' }}>
              <p style={styles.metricaLabel}>🏆 Mayor gasto</p>
              <p style={{ ...styles.metricaValor, fontSize: '16px',
                color: 'var(--cat-food)' }}>
                {gastoMayor ? fmt(gastoMayor.precio) : '-'}
              </p>
              <p style={styles.metricaSub}>
                {gastoMayor?.producto || '-'}
              </p>
            </div>
            <div style={{ ...styles.metrica, borderTopColor: 'var(--gold)' }}>
              <p style={styles.metricaLabel}>📂 Categoría líder</p>
              <p style={{ ...styles.metricaValor, fontSize: '16px',
                color: catMasUsada?.color }}>
                {catMasUsada
                  ? `${catMasUsada.emoji} ${catMasUsada.nombre}`
                  : '-'}
              </p>
              <p style={styles.metricaSub}>
                {catMasUsada ? `${catMasUsada.porcentaje}% del total` : '-'}
              </p>
            </div>
          </div>

          <div style={styles.fila}>

            {/* GRAFICA SEMANAL — GASTOS */}
            <div style={styles.card}>
              <p style={styles.cardTitulo}>📅 Gastos — últimos 7 días</p>
              <div style={styles.graficaWrap}>
                {ultimos7.map((d, i) => (
                  <div key={i} style={styles.barraWrap}>
                    <p style={styles.barraValor}>
                      {d.total > 0 ? fmt(d.total).replace('COP', '').trim() : ''}
                    </p>
                    <div style={styles.barraFondo}>
                      <div style={{
                        ...styles.barraRelleno,
                        height: `${(d.total / maxDia) * 100}%`,
                        background: d.total === Math.max(...ultimos7.map(x => x.total))
                          ? 'var(--gold)'
                          : 'var(--silver-400)',
                      }} />
                    </div>
                    <p style={styles.barraDia}>{d.dia}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* GRAFICA SEMANAL — CO2 */}
            <div style={styles.card}>
              <p style={styles.cardTitulo}>☁️ CO₂ — últimos 7 días</p>
              <div style={styles.graficaWrap}>
                {ultimos7.map((d, i) => (
                  <div key={i} style={styles.barraWrap}>
                    <p style={styles.barraValor}>
                      {d.co2 > 0 ? `${d.co2.toFixed(1)}` : ''}
                    </p>
                    <div style={styles.barraFondo}>
                      <div style={{
                        ...styles.barraRelleno,
                        height: `${(d.co2 / maxCO2) * 100}%`,
                        background: d.co2 === Math.max(...ultimos7.map(x => x.co2))
                          ? 'var(--cat-food)'
                          : 'var(--cat-tech)',
                      }} />
                    </div>
                    <p style={styles.barraDia}>{d.dia}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DESGLOSE POR CATEGORIA */}
          <div style={styles.card}>
            <p style={styles.cardTitulo}>📊 Desglose por categoría</p>
            <div style={styles.desglose}>
              {porCategoria.map(cat => (
                <div key={cat.id} style={styles.desgloseItem}>
                  <div style={styles.desgloseHeader}>
                    <div style={styles.desgloseIzq}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        background: cat.color + '22',
                        border: `1px solid ${cat.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                      }}>
                        {cat.emoji}
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Cinzel, serif', fontSize: '13px',
                          color: cat.color }}>
                          {cat.nombre}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)',
                          fontStyle: 'italic' }}>
                          {cat.co2.toFixed(1)} kg CO₂
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'Cinzel, serif', fontSize: '14px',
                        color: 'var(--silver-100)' }}>
                        {fmt(cat.total)}
                      </p>
                      <p style={{ fontSize: '11px', color: cat.color }}>
                        {cat.porcentaje}%
                      </p>
                    </div>
                  </div>
                  <div style={styles.desgloseBarraFondo}>
                    <div style={{
                      ...styles.desgloseBarraRelleno,
                      width: `${cat.porcentaje}%`,
                      background: cat.color,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
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
  vacio: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '80px 0',
    textAlign: 'center',
  },
  vacioTitulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '18px',
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
  cardTitulo: {
    fontFamily: 'Cinzel, serif',
    fontSize: '12px',
    color: 'var(--silver-200)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  graficaWrap: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    height: '120px',
  },
  barraWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    height: '100%',
  },
  barraValor: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    fontFamily: 'Cinzel, serif',
    height: '12px',
    textAlign: 'center',
  },
  barraFondo: {
    flex: 1,
    width: '100%',
    background: 'var(--bg4)',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  barraRelleno: {
    width: '100%',
    borderRadius: '2px',
    transition: 'height 0.6s ease',
    minHeight: '2px',
  },
  barraDia: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontFamily: 'Cinzel, serif',
  },
  desglose: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  desgloseItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  desgloseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  desgloseIzq: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  desgloseBarraFondo: {
    height: '3px',
    background: 'var(--bg4)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  desgloseBarraRelleno: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.6s ease',
  },
}

export default StatsPage