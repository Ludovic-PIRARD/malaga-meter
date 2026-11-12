import { AnimatePresence, motion } from 'framer-motion'
import type { ToastPayload } from '../lib/types'

type Props = {
  toasts: ToastPayload[]
}

export function ToastStack({ toasts }: Props) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
