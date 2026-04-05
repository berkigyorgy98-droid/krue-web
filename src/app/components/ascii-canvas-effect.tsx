import { useEffect, useRef } from 'react'
import exampleImage from '../assets/KRUE1.jpg'

export function AsciiCanvasEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const animationFrameRef = useRef<number>()

  const mouseRef = useRef({ x: -1000, y: -1000 })
  const prevMouseRef = useRef({ x: -1000, y: -1000 })
  const physicsRef = useRef<Float32Array | null>(null)
  
  const extraParticlesRef = useRef<any[]>([])

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
      physicsRef.current = null 
      extraParticlesRef.current = [] 
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

      if (!physicsRef.current || physicsRef.current.length !== cols * rows * 4) {
        physicsRef.current = new Float32Array(cols * rows * 4)
      }
      const phys = physicsRef.current

      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      ) * 0.9

      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale
      const offsetX = (canvas.width - scaledWidth) / 2
      const offsetY = (canvas.height - scaledHeight) / 2

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

      ctx.fillStyle = '#111111'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `bold ${cellSize}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const textColor = '#f4e9c9'
      const backgroundColor = '#111111'

      const glitchIntensity = 0.02
      const glitchActive = Math.sin(time * 5) > 0.95
      const jitterIntensity = 0.3
      
      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y
      let prevX = prevMouseRef.current.x
      let prevY = prevMouseRef.current.y

      if (prevX === -1000) { prevX = mouseX; prevY = mouseY; }

      const radius = 50; 
      const radiusSq = radius * radius;
      const dxLine = mouseX - prevX;
      const dyLine = mouseY - prevY;
      const l2 = dxLine * dxLine + dyLine * dyLine;
      
      const minLineX = Math.min(mouseX, prevX) - radius;
      const maxLineX = Math.max(mouseX, prevX) + radius;
      const minLineY = Math.min(mouseY, prevY) - radius;
      const maxLineY = Math.max(mouseY, prevY) + radius;
      
      let anyDistortedThisFrame = false;

      for (let y = 0; y < rows; y++) {
        const rowGlitch = glitchActive && random(y + time * 100) < glitchIntensity
        const rgbShift = rowGlitch ? Math.floor((random(y + time * 50) - 0.5) * 10) : 0

        for (let x = 0; x < cols; x++) {
          const jitterX = (random(y * 1000 + time * 10) - 0.5) * jitterIntensity
          const jitterY = (random(x * 1000 + time * 10 + 500) - 0.5) * jitterIntensity

          const sampleX = Math.max(0, Math.min(cols - 1, x + Math.floor(jitterX)))
          const sampleY = Math.max(0, Math.min(rows - 1, y + Math.floor(jitterY)))
          
          const i = (sampleY * cols + sampleX) * 4
          let r = imageData.data[i]
          let g = imageData.data[i + 1]
          let b = imageData.data[i + 2]

          if (rowGlitch && rgbShift !== 0) {
            const shiftedX = Math.max(0, Math.min(cols - 1, x + rgbShift))
            const ri = (sampleY * cols + shiftedX) * 4
            r = imageData.data[ri]
          }

          const brightness = (r + g + b) / 3
          const noise = (random(x * y + time * 50) - 0.5) * 10
          const adjustedBrightness = Math.max(0, Math.min(255, brightness + noise))

          let mappedBrightness = adjustedBrightness
          if (adjustedBrightness > 20) {
            mappedBrightness = 20 + (adjustedBrightness - 20) * 2.5
          }
          mappedBrightness = Math.min(255, mappedBrightness)

          const charIndex = Math.floor((mappedBrightness / 255) * (chars.length - 1))
          const char = chars[charIndex]

          const isTextPixel = mappedBrightness > 30
          ctx.fillStyle = isTextPixel ? textColor : backgroundColor
          
          const px = offsetX + (x * cellSize * scaledWidth) / (cols * cellSize) + cellSize / 2 + jitterX
          const py = offsetY + (y * cellSize * scaledHeight) / (rows * cellSize) + cellSize / 2 + jitterY

          const idx = (y * cols + x) * 4
          let dispX = phys[idx]
          let dispY = phys[idx + 1]
          let velX = phys[idx + 2]
          let velY = phys[idx + 3]

          if (mouseX > -100) {
            if (px > minLineX && px < maxLineX && py > minLineY && py < maxLineY) {
              let t = 0;
              if (l2 > 0) {
                t = ((px - prevX) * dxLine + (py - prevY) * dyLine) / l2;
                t = Math.max(0, Math.min(1, t));
              }
              const projX = prevX + t * dxLine;
              const projY = prevY + t * dyLine;
              
              const distX = px - projX;
              const distY = py - projY;
              const distSq = distX * distX + distY * distY;

              if (distSq < radiusSq) {
                const dist = Math.sqrt(distSq);
                const force = Math.pow(1 - (dist / radius), 2);

                if (Math.abs(dispX) < 1 && Math.abs(dispY) < 1) {
                   velX += (distX / (dist + 0.1)) * force * 15 + dxLine * force * 0.15;
                   velY += (distY / (dist + 0.1)) * force * 15 + dyLine * force * 0.15;
                   if (isTextPixel) anyDistortedThisFrame = true;
                }
              }
            }
          }

          if (Math.abs(dispX) > 0.05 || Math.abs(dispY) > 0.05 || Math.abs(velX) > 0.05 || Math.abs(velY) > 0.05) {
            dispX += velX
            dispY += velY
            
            // --- SOKKAL GYORSABB VISSZAÁLLÁS ---
            velX *= 0.50 // Erősebb fék: hamarabb megáll a "robbanás" után
            velY *= 0.50 

            const returnDecay = 0.75; // SOKKAL gyorsabb visszasodródás az eredeti helyre (0.90 volt)
            dispX *= returnDecay;
            dispY *= returnDecay;

            // Kicsit nagyobb bepattintási zóna, hogy érezhetően gyorsabban érjen véget az animáció
            if (Math.abs(dispX) < 0.5 && Math.abs(dispY) < 0.5 && Math.abs(velX) < 0.5 && Math.abs(velY) < 0.5) {
              dispX = 0; dispY = 0; velX = 0; velY = 0;
            }

            phys[idx] = dispX;
            phys[idx + 1] = dispY;
            phys[idx + 2] = velX;
            phys[idx + 3] = velY;
          }

          const displayChar = (rowGlitch && random(x + time * 200) < 0.1) 
            ? chars[Math.floor(random(x * y + time * 100) * chars.length)]
            : char

          if (char !== ' ') {
            const isFlying = Math.abs(dispX) > 0.5 || Math.abs(dispY) > 0.5;
            let finalChar = displayChar;

            if (isFlying) {
              finalChar = chars[Math.floor(Math.random() * chars.length)];
              ctx.fillStyle = textColor; 
            }

            ctx.fillText(finalChar, px + dispX, py + dispY)
          }
        }
      }

      if (anyDistortedThisFrame && mouseX > -100 && l2 > 1) {
        const spawnCount = Math.min(2, Math.floor(Math.sqrt(l2) * 0.04));
        
        for (let i = 0; i < spawnCount; i++) {
          if (extraParticlesRef.current.length > 30) break; 

          const tSpawn = Math.random();
          const spawnX = prevX + tSpawn * dxLine + (Math.random() - 0.5) * 30;
          const spawnY = prevY + tSpawn * dyLine + (Math.random() - 0.5) * 30;

          extraParticlesRef.current.push({
            x: spawnX,
            y: spawnY,
            vx: (Math.random() - 0.5) * 10 + dxLine * 0.05,
            vy: (Math.random() - 0.5) * 10 + dyLine * 0.05,
            char: chars[Math.floor(Math.random() * chars.length)],
            life: 1.0, 
            decay: 0.02 + Math.random() * 0.03 
          });
        }
      }

      for (let i = extraParticlesRef.current.length - 1; i >= 0; i--) {
        const p = extraParticlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.88; 
        p.vy *= 0.88;
        p.life -= p.decay; 

        if (p.life <= 0) {
          extraParticlesRef.current.splice(i, 1);
        } else {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = textColor;
          ctx.fillText(p.char, p.x, p.y);
        }
      }
      ctx.globalAlpha = 1.0;

      if (mouseX !== -1000) {
        prevMouseRef.current.x = mouseX;
        prevMouseRef.current.y = mouseY;
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 2)
      }

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
      time += 0.016
      drawAscii()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
      prevMouseRef.current = { x: -1000, y: -1000 }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    if (img.complete) animate()
    else img.onload = animate

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
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
        className="w-full h-full block"
      />
    </div>
  )
}