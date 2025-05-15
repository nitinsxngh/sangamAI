import { motion } from 'framer-motion'
import { SitemapData } from './types'
import { DesktopIcon, MagicWandIcon } from '@radix-ui/react-icons'

export function WebsiteInfoCard({
  previewData,
  sitemapData,
  selectedColor,
  setSelectedColor,
}: {
  previewData: any
  sitemapData: SitemapData | null
  selectedColor: string
  setSelectedColor: (color: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-3xl border border-white/20 bg-white/5 p-6 shadow-xl"
    >
      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
        <DesktopIcon className="w-5 h-5" />
        Website Info
      </h3>
      <div className="space-y-3">
        <p className="text-sm text-white/80 break-words">{previewData.title}</p>
        <p className="text-xs text-white/60">{previewData.description}</p>
        <img
          src={previewData.screenshot?.url}
          alt="Website preview"
          className="rounded-xl border border-white/10 shadow-md mt-2"
        />

        {(previewData.themeColor || previewData.screenshot?.palette?.length > 0) && (
          <div className="pt-4 border-t border-white/20">
            <p className="text-sm text-white/70 mb-2 flex items-center gap-2">
              <MagicWandIcon className="w-4 h-4" />
              Choose Theme Color
            </p>
            <div className="flex flex-wrap gap-4">
              {[previewData.themeColor, ...(previewData.screenshot?.palette || [])]
                .filter(Boolean)
                .slice(0, 5)
                .map((color: string, i: number) => (
                  <label key={i} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value={color}
                      checked={selectedColor === color}
                      onChange={() => setSelectedColor(color)}
                      className="form-radio text-white h-4 w-4"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white/30"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-white/70">{color}</span>
                  </label>
                ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
