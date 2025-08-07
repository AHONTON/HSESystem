import React from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const Wrapper = ({ children }) => {
  return (
    <motion.main
      className="flex flex-col w-screen h-screen overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      role="main"
      tabIndex={-1}
    >
      <ScrollReveal>
        {children}
      </ScrollReveal>
    </motion.main>
  )
}

export default Wrapper
