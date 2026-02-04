import React, { useState } from 'react';
import Button from '../ui/button';
import Input from '../ui/input';

interface MobileMinutesStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const presets = [15, 30, 45, 60];

export default function MobileMinutesStepper({
  value,
  onChange,
  min = 1,
  max = 180,
}: MobileMinutesStepperProps) {
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  const handlePreset = (preset: number) => {
    onChange(clamp(preset));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="secondary"
          className="h-14 w-14 rounded-full"
          onClick={() => onChange(clamp(value - 5))}
        >
          -
        </Button>
        <div className="text-center">
          <div className="font-serif text-6xl text-brand-navy">{value}</div>
          <div className="text-lg text-muted-foreground">minutes</div>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="h-14 w-14 rounded-full"
          onClick={() => onChange(clamp(value + 5))}
        >
          +
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => {
          const selected = value === preset;
          return (
            <button
              key={preset}
              type="button"
              className={`rounded-lg border p-4 text-center font-handwritten text-xl transition-all ${
                selected
                  ? 'border-brand-navy bg-brand-navy/10 text-brand-navy'
                  : 'border-border text-brand-navy hover:border-brand-navy'
              }`}
              onClick={() => handlePreset(preset)}
            >
              {preset} min
            </button>
          );
        })}
      </div>

      {!customMode && (
        <Button type="button" variant="outline" onClick={() => setCustomMode(true)}>
          Enter exact minutes
        </Button>
      )}

      {customMode && (
        <div className="space-y-2">
          <Input
            inputSize="lg"
            type="number"
            min={min}
            max={max}
            value={customValue}
            onChange={(event) => setCustomValue(event.target.value)}
            placeholder="Enter minutes"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => {
                const parsed = Number(customValue);
                if (!Number.isNaN(parsed)) {
                  onChange(clamp(parsed));
                }
                setCustomMode(false);
              }}
            >
              Set Minutes
            </Button>
            <Button type="button" variant="ghost" onClick={() => setCustomMode(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
