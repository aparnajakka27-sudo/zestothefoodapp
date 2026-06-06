import React, { useEffect, useRef } from 'react'

interface EmojiParticle {
  emoji: string
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  vRot: number
  scale: number
  alpha: number
  life: number
  maxLife: number
}

// Extend window interface for global trigger access
declare global {
  interface Window {
    triggerEmojiBurst: (emoji: string, count?: number) => void
  }
}

export const EmojiReaction: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<EmojiParticle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    let animationId: number

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const particles = particlesRef.current

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        
        // Physics update
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.22 // gravity
        p.rotation += p.vRot
        p.life -= 1
        p.alpha = Math.max(0, p.life / p.maxLife)

        // Draw particle
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        const size = 14 * p.scale
        let fillStyle = 'rgba(59, 130, 246, 0.85)' // Electric Blue
        if (p.emoji === '❤️' || p.emoji === '🔥' || p.emoji === '🍕') {
          fillStyle = 'rgba(244, 63, 94, 0.85)' // Rose Red
        } else if (p.emoji === '✨' || p.emoji === '👍' || p.emoji === '⭐' || p.emoji === '🔑' || p.emoji === '👑') {
          fillStyle = 'rgba(245, 158, 11, 0.85)' // Warm Gold
        } else if (p.emoji === '✅' || p.emoji === '🔗') {
          fillStyle = 'rgba(16, 185, 129, 0.85)' // Emerald Green
        }

        ctx.fillStyle = fillStyle
        ctx.shadowBlur = 12
        ctx.shadowColor = fillStyle

        // Draw an elegant 4-point star for a premium luxury look
        ctx.beginPath()
        for (let j = 0; j < 4; j++) {
          ctx.rotate(Math.PI / 2)
          ctx.lineTo(size, 0)
          ctx.lineTo(0, size * 0.25)
        }
        ctx.fill()
        ctx.restore()

        // Remove dead particles
        if (p.life <= 0 || p.y > canvas.height + 50) {
          particles.splice(i, 1)
        }
      }

      animationId = requestAnimationFrame(render)
    }
    animationId = requestAnimationFrame(render)

    // Bind to window for easy global triggers
    window.triggerEmojiBurst = (emoji: string, count = 15) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const list = particlesRef.current

      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.9 // angled upwards
        const speed = 6 + Math.random() * 8

        list.push({
          emoji,
          x: w / 2 + (Math.random() - 0.5) * 60,
          y: h * 0.7, // burst from lower center
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation: (Math.random() - 0.5) * Math.PI,
          vRot: (Math.random() - 0.5) * 0.08,
          scale: 0.7 + Math.random() * 0.6,
          alpha: 1,
          life: 80 + Math.floor(Math.random() * 40),
          maxLife: 120
        })
      }
    }

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none w-full h-full"
      style={{ zIndex: 9999 }}
    />
  )
}

export default EmojiReaction
