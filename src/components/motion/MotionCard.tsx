import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  enableSpotlight?: boolean;
  spotlightColor?: string;
  onClick?: () => void;
  key?: React.Key;
}

export function MotionCard({
  children,
  className = '',
  enableTilt = true,
  enableSpotlight = true,
  spotlightColor = 'rgba(16, 185, 129, 0.15)',
  onClick
}: MotionCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
    }
  }, []);

  // Mouse position values for 3D tilt and spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth Apple-style elastic dampening
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig);

  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isTouchDevice) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized from -0.5 to 0.5
    const normX = x / width - 0.5;
    const normY = y / height - 0.5;

    mouseX.set(normX);
    mouseY.set(normY);

    if (enableSpotlight) {
      setSpotlightPos({ x, y, opacity: 1 });
    }
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    mouseX.set(0);
    mouseY.set(0);
    if (enableSpotlight) {
      setSpotlightPos((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX: enableTilt && !isTouchDevice ? rotateX : 0,
        rotateY: enableTilt && !isTouchDevice ? rotateY : 0,
      }}
      whileHover={!isTouchDevice ? { scale: 1.015, y: -3 } : undefined}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative overflow-hidden transition-shadow duration-300 transform-gpu ${className}`}
    >
      {/* Apple-style Spotlight Reflection Layer */}
      {enableSpotlight && !isTouchDevice && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10 rounded-inherit"
          style={{
            opacity: spotlightPos.opacity,
            background: `radial-gradient(600px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${spotlightColor}, transparent 40%)`
          }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-0 h-full">{children}</div>
    </motion.div>
  );
}
