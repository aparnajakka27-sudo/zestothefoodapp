import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'
import { Button } from '../components/ui/Button'
import { ZestoLogo } from '../components/ZestoLogo'
import authIllustration from '../assets/auth_illustration.png'

export const ForgotPassword: React.FC = () => {
  const { 
    sendPasswordReset, 
    setScreen, 
    authLoading, 
    authError 
  } = useRoomStore()

  const [email, setEmail] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!email.trim()) {
      setLocalError('Please enter your email address.')
      return
    }

    try {
      await sendPasswordReset(email)
      setIsSent(true)
    } catch (err: any) {
      // Handled in store
    }
  }

  const activeError = localError || authError

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh] flex items-center justify-center p-2 md:p-6">
      
      {/* Back button */}
      <button 
        onClick={() => setScreen('login')}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-bold text-[#6D6D6D] hover:text-[#1E1E1E] transition-colors cursor-pointer select-none bg-white py-2 px-4 rounded-full border border-[#ECE6DD] shadow-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Sign In
      </button>

      {/* Main Split Layout Container */}
      <div className="w-full bg-white rounded-[32px] border border-[#ECE6DD] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] relative">
        
        {/* Left Side: Visual Illustration (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#FAF7F2] to-[#F4EFE8] flex-col justify-between p-12 relative overflow-hidden border-r border-[#ECE6DD]">
          
          <div className="absolute top-0 left-0 w-full h-full opacity-40 grid-bg pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-[#FF7A30]/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

          {/* Logo overlay */}
          <div className="flex items-center gap-2 select-none z-10">
            <ZestoLogo className="w-7 h-7" />
            <span className="text-lg font-black font-display tracking-tight text-[#1E1E1E]">Zesto</span>
          </div>

          {/* Social Vibe Illustration */}
          <div className="my-auto py-10 flex justify-center items-center z-10 relative">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="w-full max-w-[380px] rounded-3xl overflow-hidden shadow-[0_15px_35px_-10px_rgba(255,122,48,0.1)] border border-[#ECE6DD] bg-white p-2"
            >
              <img 
                src={authIllustration} 
                alt="Friends eating food together" 
                className="w-full h-auto object-cover rounded-2xl aspect-[4/3] brightness-105" 
              />
            </motion.div>
          </div>

          {/* Branding Slogans */}
          <div className="z-10 text-left">
            <h2 className="text-3xl font-black font-display tracking-tight text-[#1E1E1E] mb-3 leading-tight">
              Simple password recovery Key 🔑
            </h2>
            <p className="text-sm text-[#6D6D6D] font-semibold leading-relaxed max-w-sm">
              We'll get you back in. Just submit your email address and check your inbox.
            </p>
          </div>

        </div>

        {/* Right Side: Auth Card Form */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-md mx-auto">
            
            {/* Logo and Header for Mobile */}
            <div className="flex flex-col items-center lg:items-start mb-8 text-center lg:text-left">
              <div className="lg:hidden flex items-center gap-2 mb-4 select-none">
                <ZestoLogo className="w-8 h-8" />
                <span className="text-xl font-black font-display tracking-tight text-[#1E1E1E]">Zesto</span>
              </div>
            </div>

            {isSent ? (
              /* Success State View */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center lg:text-left space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 border border-emerald-100 mx-auto lg:mx-0 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div>
                  <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight text-[#1E1E1E] mb-2 leading-none">
                    Reset link sent 📩
                  </h1>
                  <p className="text-sm text-[#6D6D6D] font-semibold leading-relaxed">
                    Check your email inbox at <strong className="text-[#1E1E1E]">{email}</strong>. We've dispatched a password recovery link to you.
                  </p>
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={() => setScreen('login')}
                    variant="primary" 
                    size="md" 
                    className="w-full justify-center group cursor-pointer text-white bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] border-none shadow-md font-bold py-3.5 rounded-full"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Request form view */
              <>
                <div className="text-center lg:text-left mb-8">
                  <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight text-[#1E1E1E] mb-2 leading-none">
                    Forgot password?
                  </h1>
                  <p className="text-xs md:text-sm text-[#6D6D6D] font-semibold leading-relaxed">
                    Enter your email and we'll send you a reset link.
                  </p>
                </div>

                {/* Error alerts */}
                {activeError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600 text-xs font-semibold text-left"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{activeError}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Email field */}
                  <div className="text-left">
                    <label className="text-xs font-bold text-[#1E1E1E] mb-1.5 block">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#6D6D6D]">
                        <Mail className="w-4.5 h-4.5" />
                      </span>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={authLoading}
                        className="w-full pl-11 pr-4 py-3 bg-[#FAF7F2] border border-[#ECE6DD] rounded-2xl text-sm font-semibold text-[#1E1E1E] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    disabled={authLoading}
                    className="w-full justify-center group cursor-pointer text-white bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] border-none shadow-md mt-2 font-bold py-3.5 rounded-full"
                  >
                    {authLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send reset link
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </Button>

                </form>

                {/* Back Link */}
                <div className="mt-8 text-center text-xs font-semibold text-[#6D6D6D]">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => setScreen('login')}
                    disabled={authLoading}
                    className="font-bold text-[#FF7A30] hover:text-[#FF8C42] cursor-pointer transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              </>
            )}

          </div>
        </div>

      </div>

    </div>
  )
}
