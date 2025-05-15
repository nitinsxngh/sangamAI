'use client'

import { useEffect, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { cn } from '@/lib/utils'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      initialFocus={cancelButtonRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="relative z-50 max-w-lg w-full p-6 rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-blue-400/10 to-blue-500/10 shadow-2xl backdrop-blur-2xl">
        {children}
        <button
          ref={cancelButtonRef}
          onClick={onClose}
          className="mt-4 px-4 py-2 text-sm text-white bg-blue-500/30 rounded-xl hover:bg-blue-500/50 transition"
        >
          Close
        </button>
      </div>
    </Dialog>
  )
}
