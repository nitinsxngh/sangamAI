'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { ChatBox } from '@/components/studio/internal/ChatBox'
import { Message } from '@/components/studio/types'
import { Globe, Upload, Image as ImageIcon } from 'lucide-react'

export default function Feeder() {
  const [selectedColor, setSelectedColor] = useState('#2563eb')

  const [websiteUrl, setWebsiteUrl] = useState('')
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [ocrImage, setOcrImage] = useState<File | null>(null)

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
      await fetch('https://sangam.xendrax.in/webhook/6d658ad5-0cd6-472e-8f7e-8af9d7040596', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          timestamp: new Date().toISOString(),
          source: 'Feeder UI',
        }),
      })
    } catch (error) {
      console.error('Failed to send data to webhook:', error)
      setLeftMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Failed to send data to the server. Please try again later.' },
      ])
    }

    setTimeout(() => {
      setLeftMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Feeder received and stored this message. Training data simulated!' },
      ])
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
      setRightMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Retriever checked the data. Everything looks good!' },
      ])
      setIsRightTyping(false)
      setIsRightSending(false)
    }, 1500)
  }

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWebsiteUrl(e.target.value)
  }

  const handleDocumentUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setDocumentFile(e.target.files[0])
  }

  const handleOcrImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setOcrImage(e.target.files[0])
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full w-full grid grid-cols-1 md:grid-cols-2"
      >
        {/* Left Panel */}
        <div className="h-full flex flex-col border-r border-white/10 p-4 overflow-hidden">
          {/* Inputs Section */}
          <div className="space-y-4 overflow-y-auto max-h-[35%] pr-2">
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 mb-1">
                <Globe size={16} /> Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-semibold flex items-center gap-2 mb-1">
                <Upload size={16} /> Upload Document
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleDocumentUpload}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {documentFile && <p className="text-xs mt-1 text-green-400">📎 {documentFile.name}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold flex items-center gap-2 mb-1">
                <ImageIcon size={16} /> Upload Image for OCR
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleOcrImageUpload}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {ocrImage && (
                <div className="mt-1">
                  <p className="text-xs text-green-400">🖼️ {ocrImage.name}</p>
                  <img
                    src={URL.createObjectURL(ocrImage)}
                    alt="OCR Preview"
                    className="mt-1 rounded shadow-md max-h-24"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Feeder Chat */}
          <div className="flex-grow mt-4 overflow-hidden">
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
              height="100%"
              className="h-full"
              expandOnFocus
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="h-full flex flex-col p-4 overflow-hidden">
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
            height="100%"
            className="h-full"
          />
        </div>
      </motion.div>
    </div>
  )
}
