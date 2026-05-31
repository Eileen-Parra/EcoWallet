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
import NivelUp      from './components/NivelUp'
import Transicion   from './components/Transicion'
import {
  calcularXPGasto,
  calcularXPRacha,
  calcularRacha,
  verificarSubidaNivel,
} from './data/xpSystem'

function App() {
  const [pantalla, setPantalla]     = useState('intro')
  const [heroe, setHeroe]           = useState(null)
  const [gastos, setGastos]         = useState([])
  const [xp, setXp]                 = useState(0)
  const [subioNivel, setSubioNivel] = useState(null)

  useEffect(() => {
    const heroeGuardado   = localStorage.getItem('ecowallet_heroe')
    const gastosGuardados = localStorage.getItem('ecowallet_gastos')
    const xpGuardado      = localStorage.getItem('ecowallet_xp')
    if (heroeGuardado)   setHeroe(JSON.parse(heroeGuardado))
    if (gastosGuardados) setGastos(JSON.parse(gastosGuardados))
    if (xpGuardado)      setXp(parseInt(xpGuardado))
  }, [])

  useEffect(() => {
    localStorage.setItem('ecowallet_gastos', JSON.stringify(gastos))
  }, [gastos])

  useEffect(() => {
    localStorage.setItem('ecowallet_xp', xp.toString())
  }, [xp])

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
    const gastosActualizados = [nuevoGasto, ...gastos]
    setGastos(gastosActualizados)

    const xpGasto  = calcularXPGasto(nuevoGasto.precio)
    const racha    = calcularRacha(gastosActualizados)
    const xpRacha  = calcularXPRacha(racha)
    const xpGanada = xpGasto + xpRacha
    const xpNuevo  = xp + xpGanada

    const nivelNuevo = verificarSubidaNivel(xp, xpNuevo)
    if (nivelNuevo) {
      setSubioNivel(nivelNuevo)
      setTimeout(() => setSubioNivel(null), 4000)
    }

    setXp(xpNuevo)
    return xpGanada
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
    localStorage.removeItem('ecowallet_xp')
    setHeroe(null)
    setGastos([])
    setXp(0)
    setPantalla('intro')
  }

  function navegar(destino) {
    setPantalla(destino)
  }

  const renderPantalla = () => {
    if (pantalla === 'intro')
      return <IntroPage onEntrar={handleEntrarIntro} />

    if (pantalla === 'hero')
      return <HeroPage onConfirmar={handleConfirmarHeroe} />

    if (pantalla === 'mapa')
      return <MapPage heroe={heroe} xp={xp} onNavegar={navegar} />

    if (pantalla === 'dashboard')
      return (
        <Dashboard
          heroe={heroe} gastos={gastos}
          xp={xp} onNavegar={navegar}
        />
      )

    if (pantalla === 'registrar')
      return (
        <RegisterPage
          heroe={heroe}
          onGuardar={handleGuardarGasto}
          onNavegar={navegar}
        />
      )

    if (pantalla === 'pergaminos')
      return (
        <ScrollsPage
          heroe={heroe} gastos={gastos}
          onEliminar={handleEliminarGasto}
          onNavegar={navegar}
        />
      )

    if (pantalla === 'stats')
      return (
        <StatsPage heroe={heroe} gastos={gastos} onNavegar={navegar} />
      )

    if (pantalla === 'manual')
      return <ManualPage heroe={heroe} xp={xp} onNavegar={navegar} />

    if (pantalla === 'forja')
      return (
        <ForgePage
          heroe={heroe} xp={xp}
          onActualizar={handleActualizarHeroe}
          onNavegar={navegar}
          onReset={handleReset}
        />
      )

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

  return (
    <>
     <Transicion pantalla={pantalla}>
      {renderPantalla()}
     </Transicion>
      {subioNivel && (
        <NivelUp
          nivel={subioNivel}
          onCerrar={() => setSubioNivel(null)}
        />
      )}
    </>
  )
}

export default App