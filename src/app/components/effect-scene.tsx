import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { Vector2 } from "three"
import { useTexture } from "@react-three/drei"
import { AsciiEffect } from "./ascii-effect"
import exampleImage from 'figma:asset/d86797730b4dd4f32b2fabba39205c1b14e325ca.png'

function ImagePlane() {
  const texture = useTexture(exampleImage)
  
  return (
    <mesh>
      <planeGeometry args={[8, 4.5]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

export function EffectScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState(new Vector2(0, 0))
  const [resolution, setResolution] = useState(new Vector2(1920, 1080))

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = rect.height - (e.clientY - rect.top)
        setMousePos(new Vector2(x, y))
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)

      const rect = container.getBoundingClientRect()
      setResolution(new Vector2(rect.width, rect.height))

      const handleResize = () => {
        const rect = container.getBoundingClientRect()
        setResolution(new Vector2(rect.width, rect.height))
      }
      window.addEventListener("resize", handleResize)

      return () => {
        container.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-screen bg-black">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        frameloop="always"
        legacy={false}
      >
        <color attach="background" args={["#000000"]} />
        
        <Suspense fallback={null}>
          <ImagePlane />

          <EffectComposer>
            <AsciiEffect
              style="standard"
              cellSize={6}
              invert={false}
              color={true}
              resolution={resolution}
              mousePos={mousePos}
              postfx={{
                scanlineIntensity: 0.15,
                scanlineCount: 300,
                targetFPS: 0,
                jitterIntensity: 0,
                jitterSpeed: 1,
                mouseGlowEnabled: false,
                mouseGlowRadius: 200,
                mouseGlowIntensity: 1.5,
                vignetteIntensity: 0.3,
                vignetteRadius: 0.8,
                colorPalette: 0,
                curvature: 0,
                aberrationStrength: 0,
                noiseIntensity: 0.05,
                noiseScale: 100,
                noiseSpeed: 0.5,
                waveAmplitude: 0,
                waveFrequency: 10,
                waveSpeed: 1,
                glitchIntensity: 0,
                glitchFrequency: 0,
                brightnessAdjust: 0,
                contrastAdjust: 1.2,
              }}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}