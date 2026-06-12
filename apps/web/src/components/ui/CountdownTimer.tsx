'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endDate: string;
  className?: string;
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export function CountdownTimer({ endDate, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculate());
    const interval = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ];

  return (
    <div className={className} role="timer" aria-live="polite">
      <div className="flex gap-2 sm:gap-3">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur sm:h-14 sm:w-14">
              <span className="text-lg font-bold text-white sm:text-xl">{pad(unit.value)}</span>
            </div>
            <span className="mt-1 text-[10px] font-medium uppercase text-white/70 sm:text-xs">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
