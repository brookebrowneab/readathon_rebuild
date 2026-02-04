import React from 'react';
import clsx from 'clsx';

interface ReadingGoalRingProps {
  current: number;
  goal: number;
  size?: number;
  className?: string;
  showPercent?: boolean;
}

export default function ReadingGoalRing({
  current,
  goal,
  size = 50,
  className,
  showPercent = false,
}: ReadingGoalRingProps) {
  const safeGoal = goal > 0 ? goal : 1;
  const progress = Math.min(current / safeGoal, 1);
  const percent = Math.round(progress * 100);

  return (
    <div
      className={clsx('relative flex items-center justify-center', className)}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(hsl(var(--progress-stroke)) ${percent * 3.6}deg, hsl(var(--progress-bg)) 0deg)`,
        borderRadius: '999px',
        border: '2px solid hsl(var(--border))',
      }}
    >
      <div
        className="absolute rounded-full bg-background"
        style={{
          width: size - 12,
          height: size - 12,
          boxShadow: 'inset 0 0 0 1px hsl(var(--border))',
        }}
      />
      {showPercent && (
        <span className="relative z-10 text-xs font-semibold text-foreground">{percent}%</span>
      )}
    </div>
  );
}
