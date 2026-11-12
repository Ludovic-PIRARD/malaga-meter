import { AnimatePresence, motion } from 'framer-motion'

const COLOURS = ['#ffc43a', '#b8f000', '#1a8aa8', '#ff5c5c', '#ffffff']

type Props = {
  show: boolean
}

export function ConfettiBurst({ show }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.span
              key={i}
              className="confetti-piece"
              style={{
                left: `${8 + (i * 5) % 84}%`,
                top: '40%',
                background: COLOURS[i % COLOURS.length],
                rotate: `${i * 17}deg`,
              }}
              initial={{ y: 0, opacity: 1, scale: 1 }}
              animate={{
                y: 120 + (i % 5) * 20,
                x: ((i % 2) * 2 - 1) * (20 + i * 3),
                opacity: 0,
                scale: 0.6,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
