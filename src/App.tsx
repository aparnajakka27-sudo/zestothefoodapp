import { useEffect } from 'react'
import Lenis from 'lenis'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { HowItWorks } from './components/HowItWorks'
import { InteractiveDemo } from './components/InteractiveDemo'
import { BentoFeatures } from './components/BentoFeatures'
import { FoodShowcase } from './components/FoodShowcase'
import { SocialWall } from './components/SocialWall'
import { Footer } from './components/Footer'
import { RoomFlow } from './components/RoomFlow'
import { useRoomStore } from './lib/roomStore'
import { DemoModal } from './components/DemoModal'

function App() {
  const screen = useRoomStore((state) => state.screen)
  const authLoading = useRoomStore((state) => state.authLoading)
  const { isDemoOpen, setIsDemoOpen, openSelector } = useRoomStore()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0F172A] flex flex-col justify-center items-center gap-3 select-none">
        <div className="w-10 h-10 border-4 border-[#FF7A30] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-black uppercase tracking-wider text-[#FF7A30]">Restoring Session...</span>
      </div>
    )
  }

  // Initialize theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('zesto_theme') || 'light'
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Initialize Lenis smooth scrolling for premium Apple-level feel when on landing page
  useEffect(() => {
    if (screen !== 'landing') return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [screen])

  return (
    <div className="min-h-screen bg-[#FAF7F2] overflow-hidden selection:bg-[#FF7A30] selection:text-white">
      {/* Premium Sticky Navigation */}
      <Navbar />

      {/* Hero Section containing iPhone real-time voting simulation */}
      <HeroSection />

      {/* Process flow of how the rooms and veto system operates */}
      <HowItWorks />

      {/* Interactive Swiper Card Live Playground */}
      <InteractiveDemo />

      {/* Bento Grid layout of modern application capabilities */}
      <BentoFeatures />

      {/* Side-by-side Friday decision time comparison */}
      <FoodShowcase />

      {/* Wall of social reviews and user feedback */}
      <SocialWall />

      {/* Final Call to Action conversion zone and detailed footer */}
      <Footer />

      {/* Fullscreen Room Flow & Voting Interface overlay */}
      <RoomFlow />

      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onCreateRoom={() => {
          setIsDemoOpen(false)
          openSelector()
        }}
      />
    </div>
  )
}

export default App
