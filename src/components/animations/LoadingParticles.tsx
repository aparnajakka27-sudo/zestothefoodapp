import React, { useEffect, useRef } from 'react'

export const LoadingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const width = (canvas.width = 320)
    const height = (canvas.height = 360)

    const particles: Array<{
      x: number
      y: number
      r: number
      vy: number
      vx: number
      alpha: number
      emoji: string
    }> = []

    const emojis = ['🍕', '🍔', '🍣', '🍛', '🌮', '🥗', '🍩', '🍟']

    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * width,
        y: height + Math.random() * 40,
        r: Math.random() * 3 + 2,
        vy: -(Math.random() * 1.2 + 0.4),
        vx: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.3,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p) => {
        p.y += p.vy
        p.x += p.vx

        if (p.y < -20) {
          p.y = height + 20
          p.x = Math.random() * width
        }

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.font = '14px serif'
        ctx.fillText(p.emoji, p.x, p.y)
        ctx.restore()
      })
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40 rounded-[32px]" 
    />
  )
}
export default LoadingParticles
