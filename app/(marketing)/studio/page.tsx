'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { Header } from '@/components/studio/Header'
import { UrlInput } from '@/components/studio/UrlInput'
import { WebsiteInfoCard } from '@/components/studio/WebsiteInfoCard'
import { ChatBox } from '@/components/studio/ChatBox'
import { Message, SitemapData } from '@/components/studio/types'

export default function Studio() {
  const [url, setUrl] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)
  const [selectedColor, setSelectedColor] = useState<string>('#2563eb')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [sitemapData, setSitemapData] = useState<SitemapData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const [isSending, setIsSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/notify.mp3')
    }
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && url.trim() !== '') {
      setSubmitted(true)
    }
  }

  useEffect(() => {
    if (sitemapData?.filename) {
      const loadConfig = async () => {
        try {
          const response = await fetch(`/api/get-config?sitemapId=${sitemapData.filename}`)
          const config = await response.json()
  
          if (config.success && config.data) {
            setSelectedColor(config.data.selectedColor)
          }
        } catch (error) {
          console.error('Failed to load config:', error)
        }
      }
  
      loadConfig()
    }
  }, [sitemapData])
  

  const saveConfiguration = async () => {
    if (!sitemapData || !previewData) return

    try {
      const config = {
        sitemapId: sitemapData.filename,
        websiteName: previewData.title,
        selectedColor,
        scrapeFilename: sitemapData.scrape_filename,
      }

      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      const result = await response.json()
      if (result.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '🧠 I’ve memorized your design preferences — they’re safe with me!',
          },
        ])
      }
    } catch (error) {
      console.error('Failed to save configuration:', error)
    }
  }

  useEffect(() => {
    if (selectedColor && sitemapData) {
      saveConfiguration()
    }
  }, [selectedColor, sitemapData])

  useEffect(() => {
    if (submitted && url) {
      fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&palette=true`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.status === 'success') {
            const d = data.data
            setPreviewData(d)
            const theme = d.themeColor
            const palette = d.screenshot?.palette
            if (theme) {
              setSelectedColor(theme)
            } else if (palette && palette.length > 0) {
              setSelectedColor(palette[0])
            }
          }
        })
        .catch((err) => console.error('Microlink error:', err))
    }
  }, [submitted, url])

  useEffect(() => {
    if (submitted && url) {
      setIsGenerating(true)
      fetch('https://api.sangamai.in/generate-sitemap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.status === 'success') {
            setSitemapData(data)
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: `🗺️ I explored the site and found ${data.url_count} interesting pages.`,
              },
            ])

            try {
              const saveResponse = await fetch('/api/save-sitemap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              })

              const saveResult = await saveResponse.json()
              if (saveResult.success) {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: 'assistant',
                    content: '📚 I’ve read through the entire website and taken notes. All saved!',
                  },
                ])
              }
            } catch (saveError) {
              console.error('Failed to save to MongoDB:', saveError)
            }

            if (data.scrape_url) {
              setMessages((prev) => [
                ...prev,
                {
                  role: 'assistant',
                  content: `🔍 I’ve carefully read ${data.scraped_url_count} pages in detail. Ready to chat!`,
                },
              ])
            }
          } else {
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: `❌ Oops! Something went wrong: ${data.message}` },
            ])
          }
        })
        .catch((err) => {
          console.error('Backend error:', err)
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: '🚨 I had trouble exploring the site. Please try again.' },
          ])
        })
        .finally(() => setIsGenerating(false))
    }
  }, [submitted, url])

  const handleSend = async () => {
    if (!input.trim() || isSending) return

    setIsSending(true)
    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const payload = {
        message: input,
        context: {
          sitemap: sitemapData
            ? {
                url_count: sitemapData.url_count,
                filename: sitemapData.filename,
                scraped_url_count: sitemapData.scraped_url_count,
                scrape_filename: sitemapData.scrape_filename,
              }
            : null,
          website: previewData
            ? {
                title: previewData.title,
                description: previewData.description,
                url: url,
              }
            : null,
        },
      }

      const response = await fetch(
        'https://sangam.xendrax.in/webhook/efbc9578-4d9d-4130-9471-87a9fddcdc90',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      const data = await response.json()

      if (data.output) {
        const botResponse: Message = { role: 'assistant', content: data.output }
        setMessages((prev) => [...prev, botResponse])

        if (audioRef.current) {
          audioRef.current.play().catch((err) => {
            console.warn('Audio playback failed:', err)
          })
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: "🤔 Hmm… I didn’t quite get that. Want to try again?" },
        ])
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ I couldn’t connect to the chat service. Please try again in a bit!',
        },
      ])
    } finally {
      setIsSending(false)
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-blue-900/60 backdrop-blur-xl overflow-auto text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-12">
        <Header />

        <UrlInput
          url={url}
          setUrl={setUrl}
          handleKeyDown={handleKeyDown}
          submitted={submitted}
          isGenerating={isGenerating}
        />

        <AnimatePresence>
          {submitted && previewData && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10"
            >
              <WebsiteInfoCard
                previewData={previewData}
                sitemapData={sitemapData}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />

              <ChatBox
                messages={messages}
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                isSending={isSending}
                isTyping={isTyping}
                selectedColor={selectedColor}
                messagesEndRef={messagesEndRef}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
