import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      className={`card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" } : {}}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
