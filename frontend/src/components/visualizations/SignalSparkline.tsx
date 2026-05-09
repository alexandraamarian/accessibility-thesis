import { LineChart, Line, ReferenceLine, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';

interface SignalSparklineProps {
  data: number[];
  threshold: number;
  label?: string;
  color?: string;
  height?: number;
}

export function SignalSparkline({
  data,
  threshold,
  label,
  color = '#38bdf8',
  height = 40,
}: SignalSparklineProps) {
  if (data.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center opacity-30 text-xs">
        No data
      </div>
    );
  }

  const chartData = data.map((value, index) => ({ index, value }));
  const maxValue = Math.max(threshold * 1.5, ...data, 0.01);
  const lastValue = data[data.length - 1] || 0;
  const ratio = threshold > 0 ? lastValue / threshold : 0;
  const lineColor = ratio >= 1 ? '#ef4444' : ratio >= 0.7 ? '#eab308' : color;

  return (
    <div style={{ width: '100%', minWidth: 120, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <XAxis dataKey="index" hide />
          <YAxis domain={[0, maxValue]} hide />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #38bdf8',
              fontSize: 11,
              borderRadius: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
              zIndex: 50,
              opacity: 1,
            }}
            wrapperStyle={{ zIndex: 50, opacity: 1 }}
            formatter={(value: number) => [value.toFixed(2), label || 'Value']}
            labelFormatter={(idx: number) => `Snapshot #${idx}`}
          />
          <ReferenceLine y={threshold} stroke="#6b7280" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
