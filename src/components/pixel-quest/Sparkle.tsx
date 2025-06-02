
'use client';

import { useEffect, useState } from 'react';

interface SparkleEffectProps {
  trigger: boolean; // Prop to trigger the animation
  count?: number;
}

export function SparkleEffect({ trigger, count = 5 }: SparkleEffectProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 600); // Duration of the animation
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`sparkle sparkle-${(i % 5) + 1}`} // Cycle through 5 predefined sparkle positions/delays
          style={{
            // Randomize positions slightly more if needed, but CSS classes handle base
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
