'use client'

import { motion } from 'framer-motion'

export function FadeIn({
  children,
  className = '',
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.7,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const fadeUpItem = {
  hidden: {
    opacity: 0,
    y: 40,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.6,
    },
  },
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
}) {
  return (
    <motion.div
      variants={{
        hidden: {},

        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  )
}