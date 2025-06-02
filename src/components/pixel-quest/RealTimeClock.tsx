
'use client';

import { useState, useEffect } from 'react';

export function RealTimeClock() {
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Using 24-hour format for a more "digital" pixel clock feel
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setCurrentDate(now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }));
    };

    // Set time immediately on client-side mount
    updateDateTime(); 
    const timerId = setInterval(updateDateTime, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timerId);
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return (
    <div className="text-center my-6 font-body text-foreground">
      {currentDate ? (
        <p className="text-lg leading-tight mb-1">{currentDate}</p>
      ) : (
        <p className="text-lg leading-tight mb-1">Loading Date...</p>
      )}
      {currentTime ? (
        <p 
          className="text-4xl leading-none tracking-wider font-bold" 
          style={{ textShadow: '2px 2px 0px hsl(var(--primary)), -2px -2px 0px hsl(var(--primary-foreground))' }}
        >
          {currentTime}
        </p>
      ) : (
        <p className="text-4xl leading-none tracking-wider font-bold">Loading Time...</p>
      )}
    </div>
  );
}
