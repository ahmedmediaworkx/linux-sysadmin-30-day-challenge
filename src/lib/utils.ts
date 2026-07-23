import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function triggerCelebration() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6']
    });
  } catch (err) {
    console.log('Confetti failed', err);
  }
}

export function triggerDayCompleteCelebration() {
  try {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#10b981', '#34d399', '#60a5fa', '#f59e0b']
    });
  } catch (err) {
    console.log('Confetti failed', err);
  }
}
