import { AnimatePresence, motion } from 'framer-motion';

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);
