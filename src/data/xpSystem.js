export const NIVELES = [
  { nivel: 1, nombre: 'Aldeano',    emoji: '🌱', xpMin: 0,    xpMax: 199  },
  { nivel: 2, nombre: 'Aprendiz',   emoji: '⚔️', xpMin: 200,  xpMax: 499  },
  { nivel: 3, nombre: 'Guardián',   emoji: '🛡️', xpMin: 500,  xpMax: 999  },
  { nivel: 4, nombre: 'Caballero',  emoji: '🗡️', xpMin: 1000, xpMax: 1999 },
  { nivel: 5, nombre: 'General',    emoji: '🔱', xpMin: 2000, xpMax: 4999 },
  { nivel: 6, nombre: 'Conde',      emoji: '🎖️', xpMin: 5000, xpMax: 6999},
  { nivel: 7, nombre: 'Maestro',    emoji: '🔮', xpMin: 7000,  xpMax: 9999},
  { nivel: 8, nombre: 'Rey',        emoji: '👑', xpMin: 10000, xpMax: 19999},
  { nivel: 9, nombre: 'Emperador',  emoji: '🌟', xpMin: 20000, xpMax: 29999},
  { nivel: 10,nombre: 'Leyenda',    emoji: '🐉', xpMin: 30000, xpMax: 99999},
]

export const DESBLOQUEOS = {
  1: ['alimentacion', 'transporte', 'ropa'],
  3: ['tech'],
  5: ['sabiduria'],
}

// Nivel según xp
export function obtenerNivel(xp) {
  return [...NIVELES]
    .reverse()
    .find(n => xp >= n.xpMin) || NIVELES[0]
}

// Progreso dentro del nivel
export function obtenerProgreso(xp) {
  const nivelActual = obtenerNivel(xp)
  const rango = nivelActual.xpMax - nivelActual.xpMin
  const progreso = xp - nivelActual.xpMin
  return Math.round((progreso / rango) * 100)
}

// Calcula el xp cuando se agrega un gasto
export function calcularXPGasto(precio) {
  const base = 10
  const bonus = Math.floor(precio / 5000)
  return base + bonus
}

// Calcula xp de racha
export function calcularXPRacha(racha) {
  if (racha <= 1) return 0
  if (racha <= 3) return 15
  if (racha <= 7) return 30
  return 50
}

// Para saber que capítulo está desbloqueado según el nivel
export function capitulosDesbloqueados(xp) {
  const nivelActual = obtenerNivel(xp)
  const desbloqueados = []
  Object.entries(DESBLOQUEOS).forEach(([nivelReq, caps]) => {
    if (nivelActual.nivel >= parseInt(nivelReq)) {
      desbloqueados.push(...caps)
    }
  })
  return desbloqueados
}

// Verifica si la persona subió de nivel
export function verificarSubidaNivel(xpAnterior, xpNuevo) {
  const nivelAnterior = obtenerNivel(xpAnterior)
  const nivelNuevo    = obtenerNivel(xpNuevo)
  if (nivelNuevo.nivel > nivelAnterior.nivel) {
    return nivelNuevo
  }
  return null
}

// La racha
export function calcularRacha(gastos) {
  if (gastos.length === 0) return 0

  const fechasUnicas = [...new Set(gastos.map(g => g.fecha))].sort().reverse()
  if (fechasUnicas.length === 0) return 0

  const hoy = new Date().toISOString().split('T')[0]
  const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (fechasUnicas[0] !== hoy && fechasUnicas[0] !== ayer) return 0

  let racha = 1
  for (let i = 0; i < fechasUnicas.length - 1; i++) {
    const actual   = new Date(fechasUnicas[i])
    const anterior = new Date(fechasUnicas[i + 1])
    const diff = (actual - anterior) / 86400000
    if (diff === 1) {
      racha++
    } else {
      break
    }
  }
  return racha
}