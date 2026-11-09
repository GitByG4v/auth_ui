import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

/**
 * MatrixBackground
 *
 * Full-screen static binary matrix grid (0s and 1s) with silky-smooth 3D flip animations.
 * Theme-aware: dynamically transitions between light warm white (#FFFEFC) and dark obsidian (#0B0F17).
 */
export function MatrixBackground() {
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let grid = []

    const cellWidth = 34
    const cellHeight = 34

    // Track mouse position
    const mouse = {
      x: -2000,
      y: -2000,
      radius: 95,
      active: false,
    }

    const initGrid = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.scale(dpr, dpr)

      cols = Math.ceil(width / cellWidth) + 1
      rows = Math.ceil(height / cellHeight) + 1
      grid = []

      for (let r = 0; r < rows; r++) {
        const rowCells = []
        for (let c = 0; c < cols; c++) {
          const initialChar = Math.random() > 0.5 ? '1' : '0'
          rowCells.push({
            char: initialChar,
            prevChar: initialChar,
            targetChar: initialChar,
            isFlipping: false,
            flipProgress: 1,
            baseOpacity: isDark ? 0.24 + Math.random() * 0.16 : 0.16 + Math.random() * 0.12,
            glow: 0,
            wasHovered: false,
          })
        }
        grid.push(rowCells)
      }
    }

    initGrid()

    const handleResize = () => {
      initGrid()
    }
    window.addEventListener('resize', handleResize)

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
      mouse.x = -2000
      mouse.y = -2000
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    let lastTime = performance.now()

    const render = (time) => {
      animFrameRef.current = requestAnimationFrame(render)

      const delta = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      // Fill canvas background according to active theme (warm obsidian vs warm white)
      ctx.fillStyle = isDark ? '#131110' : '#FFFEFC'
      ctx.fillRect(0, 0, width, height)

      ctx.font = '600 18px "Courier New", Consolas, monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (let r = 0; r < rows; r++) {
        const y = r * cellHeight + cellHeight / 2

        for (let c = 0; c < cols; c++) {
          const x = c * cellWidth + cellWidth / 2
          const cell = grid[r][c]

          // Distance from cursor
          const dx = x - mouse.x
          const dy = y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Check if cursor triggered a flip on this cell
          if (mouse.active && dist < cellWidth * 0.85) {
            if (!cell.wasHovered && !cell.isFlipping) {
              cell.isFlipping = true
              cell.flipProgress = 0
              cell.prevChar = cell.char
              cell.targetChar = cell.char === '0' ? '1' : '0'
              cell.glow = 1.0
              cell.wasHovered = true
            }
          } else if (dist > cellWidth * 1.5) {
            cell.wasHovered = false
          }

          // Proximity ambient glow
          if (mouse.active && dist < mouse.radius) {
            const proximity = 1 - dist / mouse.radius
            cell.glow = Math.max(cell.glow, proximity * 0.75)
          }

          // Advance 3D flip animation progress
          if (cell.isFlipping) {
            cell.flipProgress += delta * 4.0

            if (cell.flipProgress >= 1.0) {
              cell.flipProgress = 1.0
              cell.isFlipping = false
              cell.char = cell.targetChar
            }
          }

          // Smoothly decay glow back to ambient
          if (cell.glow > 0) {
            cell.glow = Math.max(0, cell.glow - delta * 2.2)
          }

          // Determine current character and vertical scale for 3D flip effect
          let scaleY = 1
          let displayChar = cell.char

          if (cell.isFlipping) {
            scaleY = Math.abs(Math.cos(cell.flipProgress * Math.PI))
            displayChar = cell.flipProgress < 0.5 ? cell.prevChar : cell.targetChar
          }

          ctx.save()
          ctx.translate(x, y)

          if (scaleY < 0.99) {
            ctx.scale(1, Math.max(0.04, scaleY))
          }

          if (cell.glow > 0.05 || cell.isFlipping) {
            const glowFactor = Math.max(cell.glow, cell.isFlipping ? 0.7 : 0)
            ctx.shadowColor = isDark ? '#FF8A65' : '#FF5412'
            ctx.shadowBlur = (isDark ? 22 : 16) * glowFactor
            ctx.fillStyle = isDark ? '#FFAB91' : '#D97757'
            ctx.font = '700 19px "Courier New", Consolas, monospace'
            ctx.globalAlpha = Math.min(1.0, 0.65 + glowFactor * 0.35)
          } else {
            ctx.shadowBlur = 0
            ctx.fillStyle = isDark ? '#E07A5F' : '#D97757'
            ctx.globalAlpha = cell.baseOpacity
          }

          ctx.fillText(displayChar, 0, 0)
          ctx.restore()
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      className="matrix-canvas"
      aria-hidden="true"
    />
  )
}
