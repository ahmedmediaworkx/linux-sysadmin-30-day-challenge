import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface FluidCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function FluidCounter({ value, suffix = '', prefix = '', className = '' }: FluidCounterProps) {
  const spring = useSpring(0, { damping: 25, stiffness: 200 });
  const displayValue = useTransform(spring, (latest) => Math.round(latest));
  const [currentDisplay, setCurrentDisplay] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = displayValue.on('change', (v) => {
      setCurrentDisplay(v);
    });
    return () => unsubscribe();
  }, [displayValue]);

  return (
    <motion.span className={`inline-block font-mono font-extrabold ${className}`}>
      {prefix}
      {currentDisplay}
      {suffix}
    </motion.span>
  );
}
