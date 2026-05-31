import { useState, useEffect } from 'react'
import IntroPage    from './pages/IntroPage'
import HeroPage     from './pages/HeroPage'
import MapPage      from './pages/MapPage'
import Dashboard    from './pages/Dashboard'
import RegisterPage from './pages/RegisterPage'
import ScrollsPage  from './pages/ScrollsPage'
import StatsPage    from './pages/StatsPage'
import ManualPage   from './pages/ManualPage'
import ForgePage    from './pages/ForgePage'

function App() {
  const [pantalla, setPantalla] = useState('intro')
  const [heroe, setHeroe]       = useState(null)
  const [gastos, setGastos]     = useState([])

  useEffect(() => {
    const heroeGuardado   = localStorage.getItem('ecowallet_heroe')
    const gastosGuardados = localStorage.getItem('ecowallet_gastos')
    if (heroeGuardado)   setHeroe(JSON.parse(heroeGuardado))
    if (gastosGuardados) setGastos(JSON.parse(gastosGuardados))
  }, [])

  useEffect(() => {
    localStorage.setItem('ecowallet_gastos', JSON.stringify(gastos))
  }, [gastos])

  function handleEntrarIntro() {
    const heroeGuardado = localStorage.getItem('ecowallet_heroe')
    if (heroeGuardado) setPantalla('mapa')
    else setPantalla('hero')
  }

  function handleConfirmarHeroe(datos) {
    localStorage.setItem('ecowallet_heroe', JSON.stringify(datos))
    setHeroe(datos)
    setPantalla('mapa')
  }

  function handleGuardarGasto(nuevoGasto) {
    setGastos(prev => [nuevoGasto, ...prev])
  }

  function handleEliminarGasto(id) {
    setGastos(prev => prev.filter(g => g.id !== id))
  }

  function handleActualizarHeroe(datos) {
    localStorage.setItem('ecowallet_heroe', JSON.stringify(datos))
    setHeroe(datos)
  }

  function handleReset() {
    localStorage.removeItem('ecowallet_heroe')
    localStorage.removeItem('ecowallet_gastos')
    setHeroe(null)
    setGastos([])
    setPantalla('intro')
  }

  function navegar(destino) {
    setPantalla(destino)
  }

  if (pantalla === 'intro') {
    return <IntroPage onEntrar={handleEntrarIntro} />
  }

  if (pantalla === 'hero') {
    return <HeroPage onConfirmar={handleConfirmarHeroe} />
  }

  if (pantalla === 'mapa') {
    return <MapPage heroe={heroe} onNavegar={navegar} />
  }

  if (pantalla === 'dashboard') {
    return (
      <Dashboard heroe={heroe} gastos={gastos} onNavegar={navegar} />
    )
  }

  if (pantalla === 'registrar') {
    return (
      <RegisterPage
        heroe={heroe}
        onGuardar={handleGuardarGasto}
        onNavegar={navegar}
      />
    )
  }

  if (pantalla === 'pergaminos') {
    return (
      <ScrollsPage
        heroe={heroe}
        gastos={gastos}
        onEliminar={handleEliminarGasto}
        onNavegar={navegar}
      />
    )
  }

  if (pantalla === 'stats') {
    return (
      <StatsPage heroe={heroe} gastos={gastos} onNavegar={navegar} />
    )
  }

  if (pantalla === 'manual') {
    return (
      <ManualPage heroe={heroe} onNavegar={navegar} />
    )
  }

  if (pantalla === 'forja') {
    return (
      <ForgePage
        heroe={heroe}
        onActualizar={handleActualizarHeroe}
        onNavegar={navegar}
        onReset={handleReset}
      />
    )
  }

  return (
    <div style={{ color: 'var(--silver-200)', padding: '2rem',
      fontFamily: 'Cinzel, serif', textAlign: 'center' }}>
      <h2>🚧 En construcción: {pantalla}</h2>
      <button
        onClick={() => navegar('mapa')}
        style={{ marginTop: '1rem', fontFamily: 'Cinzel, serif',
          color: 'var(--silver-200)', background: 'none',
          border: '1px solid var(--border)', padding: '10px 20px',
          cursor: 'pointer' }}
      >
        ← Volver al mapa
      </button>
    </div>
  )
}

export default App