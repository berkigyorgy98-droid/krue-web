import { useEffect, useRef } from 'react'
import exampleImage from '../assets/KRUE1.jpg'

export function AsciiCanvasEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const chars = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@']
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }

    const drawAscii = () => {
      if (!img.complete) return
      if (canvas.width === 0 || canvas.height === 0) return

      const cellSize = 6
      const cols = Math.floor(canvas.width / cellSize)
      const rows = Math.floor(canvas.height / cellSize)

      if (cols === 0 || rows === 0) return

      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      ) * 0.9

      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale
      const offsetX = (canvas.width - scaledWidth) / 2
      const offsetY = (canvas.height - scaledHeight) / 2

      // Draw image to temporary canvas for sampling
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = cols
      tempCanvas.height = rows
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })
      if (!tempCtx) return

      tempCtx.drawImage(
        img,
        0, 0, img.width, img.height,
        0, 0, cols, rows
      )

      const imageData = tempCtx.getImageData(0, 0, cols, rows)

      // Clear canvas
      ctx.fillStyle = '#111111'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw ASCII with effects
      ctx.font = `bold ${cellSize}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Color palette
      const textColor = '#f4e9c9'
      const backgroundColor = '#111111'

      // Glitch parameters
      const glitchIntensity = 0.02
      const glitchActive = Math.sin(time * 5) > 0.95
      const jitterIntensity = 0.3
      
      for (let y = 0; y < rows; y++) {
        // Row-based RGB glitch
        const rowGlitch = glitchActive && random(y + time * 100) < glitchIntensity
        const rgbShift = rowGlitch ? Math.floor((random(y + time * 50) - 0.5) * 10) : 0

        for (let x = 0; x < cols; x++) {
          // Jitter effect
          const jitterX = (random(y * 1000 + time * 10) - 0.5) * jitterIntensity
          const jitterY = (random(x * 1000 + time * 10 + 500) - 0.5) * jitterIntensity

          const sampleX = Math.max(0, Math.min(cols - 1, x + Math.floor(jitterX)))
          const sampleY = Math.max(0, Math.min(rows - 1, y + Math.floor(jitterY)))
          
          const i = (sampleY * cols + sampleX) * 4
          let r = imageData.data[i]
          let g = imageData.data[i + 1]
          let b = imageData.data[i + 2]

          // RGB chromatic aberration
          if (rowGlitch && rgbShift !== 0) {
            const shiftedX = Math.max(0, Math.min(cols - 1, x + rgbShift))
            const ri = (sampleY * cols + shiftedX) * 4
            r = imageData.data[ri]
          }

          const brightness = (r + g + b) / 3

          // Noise
          const noise = (random(x * y + time * 50) - 0.5) * 10
          const adjustedBrightness = Math.max(0, Math.min(255, brightness + noise))

          // Enhanced contrast mapping for better readability
          let mappedBrightness = adjustedBrightness
          if (adjustedBrightness > 20) {
            // Boost brighter areas much more aggressively
            mappedBrightness = 20 + (adjustedBrightness - 20) * 2.5
          }
          mappedBrightness = Math.min(255, mappedBrightness)

          const charIndex = Math.floor((mappedBrightness / 255) * (chars.length - 1))
          const char = chars[charIndex]

          // Use brightness threshold to determine color
          // Lower threshold to catch more text pixels
          const isTextPixel = mappedBrightness > 30
          ctx.fillStyle = isTextPixel ? textColor : backgroundColor
          
          const px = offsetX + (x * cellSize * scaledWidth) / (cols * cellSize) + cellSize / 2 + jitterX
          const py = offsetY + (y * cellSize * scaledHeight) / (rows * cellSize) + cellSize / 2 + jitterY

          // Random character replacement for glitch
          const displayChar = (rowGlitch && random(x + time * 200) < 0.1) 
            ? chars[Math.floor(random(x * y + time * 100) * chars.length)]
            : char

          // Only draw if there's a character to show
          if (char !== ' ') {
            ctx.fillText(displayChar, px, py)
          }
        }
      }

      // Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 2)
      }

      // Vignette
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7
      )
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const animate = () => {
      time += 0.016 // ~60fps
      drawAscii()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Initialize canvas size first
    resizeCanvas()

    img.onload = () => {
      animate()
    }

    if (img.complete) {
      animate()
    }

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full h-screen bg-black relative">
      <img
        ref={imageRef}
        src={exampleImage}
        alt="Source"
        className="hidden"
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  )
}