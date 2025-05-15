'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Message } from '../types'
import { ChatBubbleIcon } from '@radix-ui/react-icons'

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
  title?: string
  expandOnFocus?: boolean
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
  title = 'Assistant',
  expandOnFocus = false,
}: ChatBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

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
        'rounded-3xl border p-6 shadow-xl flex flex-col',
        className
      )}
      style={{
        height,
        maxHeight: height,
        backgroundColor: 'oklch(1 0 0)', // Card background
        borderColor: 'oklch(0.922 0 0)', // Border color
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <h3
        className="text-xl font-semibold mb-2 flex items-center gap-2"
        style={{ color: 'oklch(0.145 0 0)' }}
      >
        <ChatBubbleIcon className="w-5 h-5" />
        {title}
      </h3>

      <div
        className="flex-1 overflow-y-auto space-y-2 p-4 rounded-lg mb-4"
        style={{
          backgroundColor: 'oklch(0.985 0 0)', // Very light bg for chat window
          color: 'oklch(0.145 0 0)',
        }}
      >
        {messages.length === 0 && !isTyping ? (
          <div className="h-full flex items-center justify-center" style={{ color: 'oklch(0.556 0 0)' }}>
            Start a conversation...
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'px-4 py-2 rounded-lg max-w-xs',
                  msg.role === 'user' ? 'ml-auto' : 'mr-auto'
                )}
                style={{
                  backgroundColor: msg.role === 'user'
                    ? 'oklch(1 0 0)' // White
                    : selectedColor,
                  color: msg.role === 'user'
                    ? 'oklch(0.145 0 0)'
                    : '#fff',
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
                  <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" />
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
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => !input && setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (!isSending) handleSend()
            }
          }}
          placeholder="Type your message..."
          className={cn(
            'transition-all duration-300 ease-in-out',
            'flex-1 px-4 py-2 rounded-lg outline-none disabled:opacity-70 resize-none overflow-hidden'
          )}
          style={{
            backgroundColor: 'oklch(1 0 0)',
            color: 'oklch(0.145 0 0)',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            overflowY: 'auto',
            minHeight: expandOnFocus && focused ? 150 : 42,
            maxHeight: expandOnFocus && focused ? 300 : 42,
          }}
          disabled={isSending}
        />

        <Button
          onClick={handleSend}
          disabled={isSending || input.trim() === ''}
          style={{
            backgroundColor: selectedColor,
            color: 'white',
            minWidth: '80px',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
          }}
        >
          {isSending ? (
            <span className="flex items-center">
              <span className="inline-block w-2 h-2 mx-0.5 bg-white/80 rounded-full animate-bounce" />
              <span className="inline-block w-2 h-2 mx-0.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="inline-block w-2 h-2 mx-0.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          ) : (
            'Send'
          )}
        </Button>
      </div>
    </motion.div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
