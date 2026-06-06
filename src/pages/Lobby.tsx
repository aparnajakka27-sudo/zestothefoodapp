import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Play, CheckCircle2, Circle, Star } from 'lucide-react'
import { useRoomStore } from '../lib/roomStore'

export const Lobby: React.FC = () => {
  const {
    roomCode,
    inviteLink,
    groupName,
    peopleCount,
    members,
    selectedRestaurant,
    setReady,
    startFoodSelection,
    resetRound
  } = useRoomStore()

  const [copiedLink, setCopiedLink] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const text = `Join my Zesto food squad!\nRoom: ${groupName}\nCode: ${roomCode}\nLink: ${inviteLink}`
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const currentUser = members.find(m => m.isUser)
  const isHost = members[0]?.isUser

  const handleReadyToggle = () => {
    if (currentUser) {
      setReady(currentUser.id, !currentUser.isReady)
    }
  }

  if (!selectedRestaurant) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl relative z-10 flex flex-col gap-6 text-left text-[#1E1E1E]"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#ECE6DD] pb-3">
        <div>
          <span className="text-[#FF7A30] text-[10px] font-bold tracking-wider block mb-0.5">Lobby session</span>
          <h2 className="text-xl font-black text-[#1E1E1E] tracking-tight">{groupName}</h2>
        </div>
        <button
          onClick={resetRound}
          className="text-[10px] font-bold text-[#8B8B8B] hover:text-[#FF7A30] tracking-wider transition-colors cursor-pointer"
        >
          Leave session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Restaurant detail & Invite bar */}
        <div className="md:col-span-7 flex flex-col gap-5">
          {/* Restaurant details banner */}
          <div className="bg-[#FFFFFF] border border-[#ECE6DD] p-4 rounded-2xl flex gap-4 text-left items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-14 h-14 object-cover rounded-xl border border-[#ECE6DD] shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-[#1E1E1E] tracking-wide truncate max-w-[170px]">{selectedRestaurant.name}</h3>
                <p className="text-[10px] text-[#FF7A30] font-bold tracking-wide mt-0.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{selectedRestaurant.rating}</span>
                  <span className="text-[#8B8B8B] font-normal">•</span>
                  <span className="text-[#6D6D6D] font-normal">{selectedRestaurant.distance}</span>
                </p>
              </div>
            </div>
            {selectedRestaurant.discounts && (
              <span className="text-[10px] font-bold text-[#FF7A30] bg-[#FF7A30]/5 border border-[#FF7A30]/10 px-2.5 py-1 rounded shrink-0">
                {selectedRestaurant.discounts}
              </span>
            )}
          </div>

          {/* Invitation Copy bar (Google Docs / Notion style) */}
          <div className="bg-[#FFFFFF] border border-[#ECE6DD] p-5 rounded-2xl flex flex-col gap-3.5 shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-[#FF7A30] tracking-wider block">Invite friends</span>
              <p className="text-[10px] text-[#6D6D6D] mt-0.5 leading-normal">
                Share this lobby link with friends. Once they join, start the menu food selection.
              </p>
            </div>

            {/* Notion style share line */}
            <div className="flex gap-2 items-center bg-[#FAF7F2] border border-[#ECE6DD] p-2 rounded-xl">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 bg-transparent border-none text-[10px] text-[#6D6D6D] focus:outline-none px-2 font-mono truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-[#FFFFFF] border border-[#ECE6DD] hover:bg-[#FAF7F2] rounded-lg text-[10px] font-bold text-[#1E1E1E] tracking-wide cursor-pointer transition-all shrink-0"
              >
                {copiedLink ? 'Copied' : 'Copy link'}
              </button>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold text-[#6D6D6D] mt-1 pt-1 border-t border-[#ECE6DD]">
              <span>Lobby code: <span className="text-[#1E1E1E] font-mono font-black">{roomCode}</span></span>
              <button
                onClick={handleShareWhatsApp}
                className="text-[#FF7A30] hover:text-[#FF8C42] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Friends checklist & Ready check */}
        <div className="md:col-span-5 flex flex-col gap-5 justify-between">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-[#6D6D6D] tracking-wider pl-1">
              Squad logged ({members.length} / {peopleCount})
            </span>

            {/* List of squad friends */}
            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-3 bg-[#FFFFFF] border border-[#ECE6DD] rounded-xl flex items-center justify-between transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border border-[#ECE6DD] ${member.avatarColor || 'bg-zinc-700'} flex items-center justify-center text-[11px] font-bold text-white uppercase`}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E1E1E]">{member.name}</h4>
                      <span className="text-[9px] text-[#8B8B8B] font-bold tracking-wider">{member.isUser ? 'YOU' : 'FRIEND'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {member.isReady ? (
                      <span className="flex items-center gap-1 text-[#4CAF50] text-[9px] font-bold tracking-wider bg-[#4CAF50]/10 border border-[#4CAF50]/20 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50]" /> Ready
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[#6D6D6D] text-[9px] font-bold tracking-wider bg-[#F4EFE8] border border-[#ECE6DD] px-2 py-0.5 rounded">
                        <Circle className="w-3.5 h-3.5 text-[#6D6D6D]" /> Waiting
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="flex flex-col gap-2.5 mt-5">
            {isHost ? (
              <button
                onClick={startFoodSelection}
                className="w-full py-3 bg-gradient-to-r from-[#FF7A30] to-[#FF8C42] hover:scale-[1.01] active:scale-[0.99] text-white border-none text-[11px] font-bold tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer font-sans shadow-md"
              >
                <Play className="w-4 h-4 mr-1.5 text-white" />
                Start food selection
              </button>
            ) : (
              <div className="text-center p-3.5 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl text-[10px] font-bold text-[#6D6D6D] tracking-wider">
                Waiting for host to start food selection...
              </div>
            )}

            <button
              onClick={handleReadyToggle}
              className={`w-full py-3 border rounded-xl text-[10px] font-bold tracking-wider transition-all cursor-pointer text-center ${
                currentUser?.isReady
                  ? 'bg-[#4CAF50]/10 border-[#4CAF50]/25 text-[#4CAF50]'
                  : 'bg-[#FFFFFF] border-[#ECE6DD] text-[#6D6D6D] hover:text-[#1E1E1E] hover:border-[#FF7A30]/50 shadow-sm'
              }`}
            >
              {currentUser?.isReady ? 'You are ready' : 'Toggle ready status'}
            </button>
        </div>

      </div>

    </div>

    </motion.div>
  )
}

export default Lobby
