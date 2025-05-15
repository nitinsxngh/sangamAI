import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Message } from './types'
import {
  RocketIcon,
  LockClosedIcon,
  ChatBubbleIcon,
} from '@radix-ui/react-icons'

interface ChatBoxProps {
  messages: Message[]
  input: string
  setInput: (value: string) => void
  handleSend: () => void
  isSending: boolean
  isTyping: boolean
  selectedColor: string
  messagesEndRef: React.RefObject<HTMLDivElement>
  height?: string | number
  className?: string
}

export function ChatBox({
  messages,
  input,
  setInput,
  handleSend,
  isSending,
  isTyping,
  selectedColor,
  messagesEndRef,
  height = 570,
  className = '',
}: ChatBoxProps) {
  const [copiedType, setCopiedType] = useState<null | 'script' | 'link'>(null)

  const embedScript = `<script src="https://example.com/embed.js" data-theme="${selectedColor}"></script>`
  const shareLink = `https://example.com/chat?color=${encodeURIComponent(selectedColor)}`

  const handleCopy = (text: string, type: 'script' | 'link') => {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 1500)
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={cn(
        'rounded-3xl border border-white/20 bg-white/5 p-6 shadow-xl flex flex-col',
        className
      )}
      style={{ height, maxHeight: height }}
    >
      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
        <ChatBubbleIcon className="w-5 h-5" />
        Assistant
      </h3>

      <div className="flex-1 overflow-y-auto space-y-2 bg-white/10 p-4 rounded-lg mb-4">
        {messages.length === 0 && !isTyping ? (
          <div className="h-full flex items-center justify-center text-white/50">
            Start a conversation...
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'px-4 py-2 rounded-lg max-w-xs',
                  msg.role === 'user'
                    ? 'ml-auto bg-white text-black'
                    : 'mr-auto'
                )}
                style={{
                  backgroundColor: msg.role === 'assistant' ? selectedColor : undefined,
                  color: msg.role === 'assistant' ? '#fff' : undefined,
                }}
              >
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div
                className="mr-auto px-4 py-2 rounded-lg max-w-xs"
                style={{ backgroundColor: selectedColor }}
              >
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSend()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg bg-white text-black outline-none disabled:opacity-70"
          disabled={isSending}
        />
        <Button
          onClick={handleSend}
          style={{
            backgroundColor: selectedColor,
            color: 'white',
            minWidth: '80px'
          }}
          disabled={isSending || input.trim() === ''}
        >
          {isSending ? (
            <span className="flex items-center">
              <span className="inline-block w-2 h-2 mx-0.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="inline-block w-2 h-2 mx-0.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="inline-block w-2 h-2 mx-0.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          ) : (
            'Send'
          )}
        </Button>
      </div>

      <div className="pt-4 mt-4 border-t border-white/20 space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-white/70 flex items-center gap-2">
            <RocketIcon className="w-4 h-4" />
            Copy Embed Script
          </p>
          <button
            onClick={() => handleCopy(embedScript, 'script')}
            className="text-blue-300 text-sm hover:underline"
          >
            {copiedType === 'script' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-white/70 flex items-center gap-2">
            <LockClosedIcon className="w-4 h-4" />
            Copy Share Link
          </p>
          <button
            onClick={() => handleCopy(shareLink, 'link')}
            className="text-blue-300 text-sm hover:underline"
          >
            {copiedType === 'link' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
