import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between"
    >
      <h1 className="text-4xl font-bold tracking-tight">SangamAI Studio</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="text-white hover:bg-white/10"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </motion.div>
  )
}