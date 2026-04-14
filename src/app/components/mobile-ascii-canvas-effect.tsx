import { useEffect, useRef } from 'react'
import mobileImage from '../assets/KRUE2.png'

export function MobileAsciiCanvasEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const animationFrameRef = useRef<number>()

  // Érintés tárolása (x, y, és hogy épp nyomja-e a kijelzőt)
  const touchRef = useRef({ x: -1000, y: -1000, isTouching: false })
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
      
      const touchX = touchRef.current.x
      const touchY = touchRef.current.y
      const isTouching = touchRef.current.isTouching

      // Mobilon nagyobb a sugár, mert az ujjunk vastagabb
      const radius = 70; 
      const radiusSq = radius * radius;
      
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

          // --- KAOTIKUS ÉRINTÉS FIZIKA ---
          if (isTouching && touchX > -100) {
            const dxTouch = px - touchX;
            const dyTouch = py - touchY;
            
            // GPU kímélő Bounding Box
            if (Math.abs(dxTouch) < radius && Math.abs(dyTouch) < radius) {
              const distSq = dxTouch * dxTouch + dyTouch * dyTouch;
              
              if (distSq < radiusSq) {
                const dist = Math.sqrt(distSq);
                const force = Math.pow(1 - (dist / radius), 2); // Puha átmenet

                // Csak akkor rúgjuk fel, ha épp a helyén van
                if (Math.abs(dispX) < 1 && Math.abs(dispY) < 1) {
                   // --- MÓDOSÍTVA ---
                   // Sokkal nagyobb robbanóerő (18 -> 30) ÉS sokkal több random pörgés (12 -> 25)
                   velX += (dxTouch / (dist + 0.1)) * force * 30 + (Math.random() - 0.5) * 25;
                   velY += (dyTouch / (dist + 0.1)) * force * 30 + (Math.random() - 0.5) * 25 - 2; // Kicsit felfelé is lökjük
                   if (isTextPixel) anyDistortedThisFrame = true;
                }
              }
            }
          }

          // Ha nincs a helyén, számolunk rá fizikát
          if (Math.abs(dispX) > 0.05 || Math.abs(dispY) > 0.05 || Math.abs(velX) > 0.05 || Math.abs(velY) > 0.05) {
            dispX += velX
            dispY += velY
            
            // --- MÓDOSÍTVA ---
            // Kisebb fék, hogy tovább szállingózzanak (0.50 -> 0.70)
            velX *= 0.70 
            velY *= 0.70 

            // Kicsit lassabb visszasodródás a helyére (0.75 -> 0.85), hogy tovább élvezzük a lebegést
            const returnDecay = 0.85; 
            dispX *= returnDecay;
            dispY *= returnDecay;

            // Bepattintási zóna maradt
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
            // Visszaalakulás (Decoding) effekt
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

      // --- EXTRA RÉSZECSKÉK (Érintéskor kaotikusabb por) ---
      if (anyDistortedThisFrame && isTouching) {
        // Maradt 2 db részecske per frame mobilon
        const spawnCount = 2;
        
        for (let i = 0; i < spawnCount; i++) {
          if (extraParticlesRef.current.length > 25) break; // Hard limit 25 mobilon

          extraParticlesRef.current.push({
            x: touchX + (Math.random() - 0.5) * 40,
            y: touchY + (Math.random() - 0.5) * 40,
            // --- MÓDOSÍTVA ---
            vx: (Math.random() - 0.5) * 18, // Gyorsabb porrészecskék (15 -> 18)
            vy: (Math.random() - 0.5) * 18,
            char: chars[Math.floor(Math.random() * chars.length)],
            life: 1.0, 
            decay: 0.03 + Math.random() * 0.04 // Gyorsabban tűnnek el
          });
        }
      }

      // Extra részecskék kirajzolása
      for (let i = extraParticlesRef.current.length - 1; i >= 0; i--) {
        const p = extraParticlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        // Puhább fék a pornak
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
      const isMobile = window.innerWidth < 768
      const speedMultiplier = isMobile ? 0.5 : 1.0
      time += 0.016 * speedMultiplier
      drawAscii()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // --- ÉRINTÉS (TOUCH) ESEMÉNYEK ---
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchRef.current = { x: touch.clientX, y: touch.clientY, isTouching: true }
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchRef.current = { x: touch.clientX, y: touch.clientY, isTouching: true }
    }
    
    const handleTouchEnd = () => {
      touchRef.current = { ...touchRef.current, isTouching: false }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Figyelők rákötése a canvasra
    const cvs = canvasRef.current;
    if (cvs) {
      cvs.addEventListener('touchstart', handleTouchStart, { passive: true })
      cvs.addEventListener('touchmove', handleTouchMove, { passive: true })
      cvs.addEventListener('touchend', handleTouchEnd)
      cvs.addEventListener('touchcancel', handleTouchEnd)
    }

    if (img.complete) animate()
    else img.onload = animate

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (cvs) {
        cvs.removeEventListener('touchstart', handleTouchStart)
        cvs.removeEventListener('touchmove', handleTouchMove)
        cvs.removeEventListener('touchend', handleTouchEnd)
        cvs.removeEventListener('touchcancel', handleTouchEnd)
      }
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <div className="w-full h-screen bg-black relative">
      <img
        ref={imageRef}
        src={mobileImage}
        alt="Source"
        className="hidden"
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: 'pan-y' }} 
      />
    </div>
  )
}