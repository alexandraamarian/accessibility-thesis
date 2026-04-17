interface ThresholdGaugeProps {
  value: number;
  threshold: number;
  label: string;
  format?: (v: number) => string;
}

export function ThresholdGauge({
  value,
  threshold,
  label,
  format = (v) => v.toFixed(1),
}: ThresholdGaugeProps) {
  const ratio = Math.min(value / threshold, 1.5);
  const percentage = Math.min(ratio * 100, 100);

  const getColor = () => {
    if (ratio >= 1) return '#ef4444';
    if (ratio >= 0.7) return '#eab308';
    return '#22c55e';
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-32 truncate opacity-75" title={label}>{label}</span>
      <div className="flex-1 relative h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: getColor(),
          }}
        />
        <div
          className="absolute inset-y-0 w-0.5 bg-white opacity-50"
          style={{ left: '66.6%' }}
          title="70% warning threshold"
        />
      </div>
      <span className="w-16 text-right font-mono" style={{ color: getColor() }}>
        {format(value)}
      </span>
    </div>
  );
}
