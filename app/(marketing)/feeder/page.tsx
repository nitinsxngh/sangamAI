'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChatBox } from '@/components/studio/internal/ChatBox'
import { Message } from '@/components/studio/types'

export default function Feeder() {
  const [selectedColor, setSelectedColor] = useState('#2563eb')
  const messagesEndRefLeft = useRef<HTMLDivElement>(null)
  const messagesEndRefRight = useRef<HTMLDivElement>(null)

  const [leftMessages, setLeftMessages] = useState<Message[]>([])
  const [leftInput, setLeftInput] = useState('')
  const [isLeftSending, setIsLeftSending] = useState(false)
  const [isLeftTyping, setIsLeftTyping] = useState(false)

  const [rightMessages, setRightMessages] = useState<Message[]>([])
  const [rightInput, setRightInput] = useState('')
  const [isRightSending, setIsRightSending] = useState(false)
  const [isRightTyping, setIsRightTyping] = useState(false)

  const handleLeftSend = async () => {
    if (!leftInput.trim() || isLeftSending) return
  
    setIsLeftSending(true)
    const userMessage: Message = { role: 'user', content: leftInput }
    setLeftMessages((prev) => [...prev, userMessage])
    setLeftInput('')
    setIsLeftTyping(true)
  
    try {
      // Send the data to the webhook
      await fetch('https://sangam.xendrax.in/webhook/6d658ad5-0cd6-472e-8f7e-8af9d7040596', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          timestamp: new Date().toISOString(), // Optional, you can include meta
          source: 'Feeder UI', // Optional identifier
        }),
      })
    } catch (error) {
      console.error('Failed to send data to webhook:', error)
      // Optionally add an error message to the chat
      setLeftMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Failed to send data to the server. Please try again later.',
        },
      ])
    }
  
    setTimeout(() => {
      const botMessage: Message = {
        role: 'assistant',
        content: 'Feeder received and stored this message. Training data simulated!',
      }
      setLeftMessages((prev) => [...prev, botMessage])
      setIsLeftTyping(false)
      setIsLeftSending(false)
    }, 1500)
  }
  

  const handleRightSend = async () => {
    if (!rightInput.trim() || isRightSending) return

    setIsRightSending(true)
    const userMessage: Message = { role: 'user', content: rightInput }
    setRightMessages((prev) => [...prev, userMessage])
    setRightInput('')
    setIsRightTyping(true)

    setTimeout(() => {
      const botMessage: Message = {
        role: 'assistant',
        content: 'Retriever checked the data. Everything looks good!'
      }
      setRightMessages((prev) => [...prev, botMessage])
      setIsRightTyping(false)
      setIsRightSending(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-blue-900/60 backdrop-blur-xl overflow-auto text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10"
        >
          <ChatBox
            title="Feeder"
            messages={leftMessages}
            input={leftInput}
            setInput={setLeftInput}
            handleSend={handleLeftSend}
            isSending={isLeftSending}
            isTyping={isLeftTyping}
            selectedColor={selectedColor}
            messagesEndRef={messagesEndRefLeft}
            height="585px"  // 10% smaller than 650px
            className="border-r border-white/20 pr-6"
            expandOnFocus // ✅ Enable expand-on-focus
          />

          <ChatBox
            title="Retriever"
            messages={rightMessages}
            input={rightInput}
            setInput={setRightInput}
            handleSend={handleRightSend}
            isSending={isRightSending}
            isTyping={isRightTyping}
            selectedColor={selectedColor}
            messagesEndRef={messagesEndRefRight}
            height="585px"  // 10% smaller than 650px
            className="pl-6"
          />
        </motion.div>
      </div>
    </div>
  )
}
