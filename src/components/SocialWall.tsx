import React from 'react'
import { Card } from './ui/Card'
import { Avatar } from './ui/Avatar'
import { MessageSquare, Heart, Share } from 'lucide-react'

interface Post {
  name: string
  handle: string
  avatar: string
  color: string
  content: string
  likes: string
}

const MOCK_POSTS: Post[] = [
  {
    name: "Jack",
    handle: "@jack_k",
    avatar: "J",
    color: "bg-rose-500",
    content: "Bro we actually decided where to eat in 30 seconds. Zesto saved our Friday night.",
    likes: "1.4k"
  },
  {
    name: "Sarah",
    handle: "@saraah",
    avatar: "S",
    color: "bg-indigo-500",
    content: "The single veto policy is elite. No more letting Dave drag us to burger places we hate.",
    likes: "942"
  },
  {
    name: "Ethan",
    handle: "@0x_ethan",
    avatar: "E",
    color: "bg-emerald-500",
    content: "Splitting the bill inside the room before we even sit down. Insanely good UX.",
    likes: "612"
  },
  {
    name: "Lorenzo",
    handle: "@lorenzo_v",
    avatar: "L",
    color: "bg-amber-500",
    content: "Tinder but for ramen. Zesto is actually a cheat code for friend groups.",
    likes: "1.8k"
  },
  {
    name: "Amanda",
    handle: "@amanda.t",
    avatar: "A",
    color: "bg-purple-500",
    content: "My friends argue about food for 2 hours every weekend. We used Zesto today and matched on tacos in 10 seconds. Life changing.",
    likes: "3.2k"
  },
  {
    name: "Dan",
    handle: "@dev_dan",
    avatar: "D",
    color: "bg-sky-500",
    content: "Zesto has solved our group chat's single biggest argument. Supabase database sync is so quick too.",
    likes: "450"
  }
]

export const SocialWall: React.FC = () => {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#FAF7F2] relative overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF7A30] opacity-[0.04] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[#FF7A30] text-xs font-black tracking-widest uppercase mb-3 block">Buzz</span>
          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-[#1E1E1E] mb-6">
            Loved by hungry groups
          </h2>
          <p className="text-lg text-[#6D6D6D] font-semibold">
            See what friend groups are saying on Twitter and social feeds about Zesto.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_POSTS.map((post, idx) => (
            <Card key={idx} className="p-6 hoverable flex flex-col justify-between bg-white border border-[#ECE6DD] shadow-[0_4px_20px_rgba(0,0,0,0.02)]" hoverable={true}>
              <div>
                {/* Profile row */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar fallback={post.avatar} color={post.color} size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1E1E] leading-none mb-1">{post.name}</h4>
                    <span className="text-[10px] text-[#6D6D6D] font-semibold">{post.handle}</span>
                  </div>
                  <span className="ml-auto text-xs text-[#6D6D6D]/60 font-semibold">Twitter</span>
                </div>

                {/* Content */}
                <p className="text-sm text-[#1E1E1E] leading-relaxed font-semibold">
                  "{post.content}"
                </p>
              </div>

              {/* Action indicators */}
              <div className="flex gap-6 mt-6 pt-4 border-t border-[#ECE6DD] text-[#6D6D6D] text-xs font-semibold">
                <span className="flex items-center gap-1.5 hover:text-[#FF7A30] transition-colors cursor-pointer select-none">
                  <Heart className="w-3.5 h-3.5" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1.5 hover:text-[#1E1E1E] transition-colors cursor-pointer select-none">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Reply
                </span>
                <span className="flex items-center gap-1.5 hover:text-[#1E1E1E] transition-colors cursor-pointer select-none">
                  <Share className="w-3.5 h-3.5" />
                  Share
                </span>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
