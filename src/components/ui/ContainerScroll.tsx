import React, { useRef, useEffect, useState } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'

interface ContainerScrollProps {
  titleComponent: string | React.ReactNode
  children: React.ReactNode
  className?: string
}

export const ContainerScroll: React.FC<ContainerScrollProps> = ({
  titleComponent,
  children,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Rotate from 20 degrees back to 0 degrees as you scroll
  const rotate = useTransform(scrollYProgress, [0, 1], [15, 0])
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.85, 1] : [1.05, 1])
  const translate = useTransform(scrollYProgress, [0, 1], [0, -40])

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center flex-col overflow-y-auto px-4 md:px-8 py-10 md:py-20 ${className}`}
      style={{
        perspective: '1000px',
      }}
    >
      <div className="w-full max-w-4xl relative">
        <motion.div
          style={{
            translateY: translate,
          }}
          className="max-w-3xl mx-auto text-center mb-8"
        >
          {titleComponent}
        </motion.div>

        <motion.div
          style={{
            rotateX: rotate,
            scale,
            transformStyle: 'preserve-3d',
          }}
          className="mx-auto w-full max-w-md md:max-w-xl glass-card rounded-[36px] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-2.5 md:p-4 bg-neutral-900/90 backdrop-blur-2xl"
        >
          <div className="w-full h-full rounded-[28px] overflow-hidden bg-neutral-950/80">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
