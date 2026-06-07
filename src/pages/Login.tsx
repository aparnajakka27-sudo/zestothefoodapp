import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'
import { Button } from '../components/ui/Button'
import { ZestoLogo } from '../components/ZestoLogo'
import authIllustration from '../assets/auth_illustration.png'

export const Login: React.FC = () => {
  const { 
    signInWithEmail, 
    signInWithGoogle, 
    setScreen, 
    authLoading, 
    authError 
  } = useRoomStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields.')
      return
    }

    try {
      await signInWithEmail(email, password)
    } catch (err: any) {
      // Error message is already handled inside the store authError state
    }
  }

  const handleGoogleSignIn = async () => {
    setLocalError(null)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      // Handled inside store
    }
  }

  const handleGuestMode = () => {
    setScreen('selector')
  }

  const activeError = localError || authError

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[80vh] flex items-center justify-center p-2 md:p-6 relative pt-16 md:pt-6">
      
      {/* Back button */}
      <button 
        onClick={() => setScreen('landing')}
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-xs font-bold text-[#6D6D6D] hover:text-[#1E1E1E] transition-colors cursor-pointer select-none bg-white py-2 px-4 rounded-full border border-[#ECE6DD] shadow-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </button>

      {/* Main Split Layout Container */}
      <div className="w-full bg-white rounded-[32px] border border-[#ECE6DD] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[650px] relative">
        
        {/* Left Side: Visual Illustration (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#FAF7F2] to-[#F4EFE8] flex-col justify-between p-12 relative overflow-hidden border-r border-[#ECE6DD]">
          
          {/* Subtle grid and accent circle backgrounds */}
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
              Food decisions made easy 🍽
            </h2>
            <p className="text-sm text-[#6D6D6D] font-semibold leading-relaxed max-w-sm">
              Create rooms, vote with friends, and decide what to eat together without the endless group chat arguments.
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
              <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight text-[#1E1E1E] mb-2 leading-none">
                Welcome back
              </h1>
              <p className="text-xs md:text-sm text-[#6D6D6D] font-semibold leading-relaxed">
                Sign in to continue planning meals with friends.
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

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
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

              {/* Password field */}
              <div className="text-left">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-[#1E1E1E] block">Password</label>
                  <button 
                    type="button"
                    onClick={() => setScreen('forgot_password')}
                    disabled={authLoading}
                    className="text-[10px] font-bold text-[#FF7A30] hover:text-[#FF8C42] cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#6D6D6D]">
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={authLoading}
                    className="w-full pl-11 pr-11 py-3 bg-[#FAF7F2] border border-[#ECE6DD] rounded-2xl text-sm font-semibold text-[#1E1E1E] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={authLoading}
                    className="absolute inset-y-0 right-4 flex items-center text-[#6D6D6D] hover:text-[#1E1E1E] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
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
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>

            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#ECE6DD]"></div>
              </div>
              <span className="relative z-10 px-3 bg-white text-[10px] font-black uppercase text-[#8B8B8B] tracking-wider">
                or continue with
              </span>
            </div>

            {/* Third party buttons */}
            <div className="space-y-3">
              
              {/* Google CTA */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#FAF7F2] border border-[#ECE6DD] py-3 px-6 rounded-full text-sm font-semibold text-[#1E1E1E] cursor-pointer transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
              >
                {/* Google Icon SVG */}
                <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>

              {/* Guest CTA */}
              <button
                type="button"
                onClick={handleGuestMode}
                disabled={authLoading}
                className="w-full flex items-center justify-center text-xs font-bold text-[#6D6D6D] hover:text-[#FF7A30] py-2 cursor-pointer transition-colors"
              >
                Continue as Guest
              </button>

            </div>

            {/* Bottom text */}
            <div className="mt-8 text-center text-xs font-semibold text-[#6D6D6D]">
              New to Zesto?{' '}
              <button
                type="button"
                onClick={() => setScreen('signup')}
                disabled={authLoading}
                className="font-bold text-[#FF7A30] hover:text-[#FF8C42] cursor-pointer transition-colors"
              >
                Create an account
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
