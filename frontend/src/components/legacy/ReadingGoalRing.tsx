import clsx from 'clsx';

interface ReadingGoalRingProps {
  progress: number;
  goal: number;
  size?: number;
  mobileSize?: number;
  showLabel?: boolean;
}

export default function ReadingGoalRing({
  progress,
  goal,
  size = 220,
  mobileSize,
  showLabel = true,
}: ReadingGoalRingProps) {
  const ringSize = mobileSize ?? size;
  const stroke = 10;
  const radius = (ringSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = goal > 0 ? Math.min(100, Math.round((progress / goal) * 100)) : 0;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: ringSize, height: ringSize }}>
        <svg width={ringSize} height={ringSize} className="-rotate-90">
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            stroke="hsl(var(--progress-bg))"
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            stroke="hsl(var(--progress-stroke))"
            strokeWidth={stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
      </div>
      {showLabel && (
        <div className="mt-3 text-center">
          <div className={clsx('font-serif text-3xl text-brand-navy')}>{pct}%</div>
          <div className="text-sm text-muted-foreground">
            {progress}/{goal} min
          </div>
        </div>
      )}
    </div>
  );
}
