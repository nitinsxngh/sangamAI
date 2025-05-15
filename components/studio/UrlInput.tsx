'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function UrlInput({
  url,
  setUrl,
  handleKeyDown,
  submitted,
  isGenerating,
}: {
  url: string
  setUrl: (value: string) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  submitted: boolean
  isGenerating: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={cn(
        'flex flex-col items-center justify-center transition-all duration-500',
        submitted ? 'mt-4' : 'mt-40'
      )}
    >
      <input
        type="text"
        placeholder="Paste your website URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={submitted}
        autoFocus
        className={cn(
          'bg-transparent text-3xl text-white placeholder-white/50 focus:outline-none w-full max-w-xl text-center',
          submitted && 'text-xl opacity-80'
        )}
        style={{
          borderBottom: submitted ? 'none' : '2px solid white',
          caretColor: '#ffffff', // ensures white blinking caret
        }}
      />
      {isGenerating && (
        <p className="mt-2 text-sm text-white/70">
          Generating sitemap and scraping content...
        </p>
      )}
    </motion.div>
  )
}
