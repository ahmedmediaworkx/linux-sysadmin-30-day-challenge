import React from 'react';
import { motion, Variants } from 'motion/react';

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  distance?: number;
  duration?: number;
  once?: boolean;
  key?: React.Key;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  staggerChildren,
  distance = 40,
  duration = 0.6,
  once = true
}: ScrollRevealProps) {
  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: distance
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        ease: EASE_OUT_EXPO,
        delay: delay,
        ...(staggerChildren ? { staggerChildren, delayChildren: delay } : {})
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: once, margin: '-40px' }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface ScrollRevealItemProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
  key?: React.Key;
}

export function ScrollRevealItem({
  children,
  className = '',
  delay = 0,
  distance = 40,
  duration = 0.6
}: ScrollRevealItemProps) {
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: distance
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        ease: EASE_OUT_EXPO,
        delay: delay
      }
    }
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
