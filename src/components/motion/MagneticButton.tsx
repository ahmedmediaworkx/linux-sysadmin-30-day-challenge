import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  magneticStrength?: number; // pull strength
  key?: React.Key;
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  disabled = false,
  magneticStrength = 0.35
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled || isTouchDevice) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    setPosition({ x: middleX * magneticStrength, y: middleY * magneticStrength });
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: isTouchDevice ? 0 : position.x, y: isTouchDevice ? 0 : position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.2 }}
      whileHover={!isTouchDevice ? { scale: 1.04 } : undefined}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-colors min-h-[44px] touch-manipulation transform-gpu ${className}`}
    >
      {children}
    </motion.button>
  );
}
