import { useEffect, useRef, useState } from 'react'

interface AutoScaleTitleProps {
  children: string
  className?: string
}

export function AutoScaleTitle({ children, className = '' }: AutoScaleTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !textRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const textWidth = textRef.current.scrollWidth

      if (textWidth > containerWidth) {
        const newScale = containerWidth / textWidth
        setScale(newScale * 0.98) // Slightly smaller to ensure it fits
      } else {
        setScale(1)
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)

    // Small delay to ensure fonts are loaded
    const timeout = setTimeout(updateScale, 100)

    return () => {
      window.removeEventListener('resize', updateScale)
      clearTimeout(timeout)
    }
  }, [children])

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <h2
        ref={textRef}
        className={className}
        style={{
          transform: `scaleX(${scale})`,
          transformOrigin: 'left center',
          display: 'inline-block',
          whiteSpace: 'nowrap'
        }}
      >
        {children}
      </h2>
    </div>
  )
}
