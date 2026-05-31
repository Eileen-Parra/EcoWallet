import { useState, useEffect } from 'react'

function Transicion({ children, pantalla }) {
  const [fase, setFase] = useState('entrando')

  useEffect(() => {
    setFase('entrando')
    const timer = setTimeout(() => setFase('visible'), 50)
    return () => clearTimeout(timer)
  }, [pantalla])

  const opacidad = fase === 'visible' ? 1 : 0
  const traslado = fase === 'visible' ? '0px' : '20px'

  return (
    <div style={{
      opacity:    opacidad,
      transform:  `translateY(${traslado})`,
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      minHeight:  '100vh',
    }}>
      {children}
    </div>
  )
}

export default Transicion