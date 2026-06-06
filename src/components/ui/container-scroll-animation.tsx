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

  // 3D rotations: rotate along X-axis from 15deg down to 0deg as we scroll
  const rotate = useTransform(scrollYProgress, [0, 1], [12, 0])
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.88, 1] : [1.01, 1])
  const translate = useTransform(scrollYProgress, [0, 1], [0, -20])

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center flex-col overflow-y-auto px-2 md:px-4 py-6 md:py-10 ${className}`}
      style={{
        perspective: '1000px',
      }}
    >
      <div className="w-full max-w-4xl relative">
        <motion.div
          style={{
            translateY: translate,
          }}
          className="max-w-2xl mx-auto text-center mb-5"
        >
          {titleComponent}
        </motion.div>

        <motion.div
          style={{
            rotateX: rotate,
            scale,
            transformStyle: 'preserve-3d',
          }}
          className="mx-auto w-full max-w-md md:max-w-xl bg-gradient-to-b from-[#161622]/95 to-[#0D0D15]/98 backdrop-blur-3xl border border-[#C9A227]/20 rounded-[36px] p-3 md:p-4 shadow-[0_30px_90px_rgba(0,0,0,0.95),_0_0_20px_rgba(201,162,39,0.05)]"
        >
          <div className="w-full h-full rounded-[26px] overflow-hidden bg-black/80">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ContainerScroll
