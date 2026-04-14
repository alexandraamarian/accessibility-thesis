import { LineChart, Line, ReferenceLine, ResponsiveContainer, YAxis } from 'recharts';

interface SignalSparklineProps {
  data: number[];
  threshold: number;
  color?: string;
  height?: number;
}

export function SignalSparkline({
  data,
  threshold,
  color = '#38bdf8',
  height = 40,
}: SignalSparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }));

  const maxValue = Math.max(threshold * 1.5, ...data);
  const lastValue = data[data.length - 1] || 0;
  const ratio = lastValue / threshold;
  const lineColor = ratio >= 1 ? '#ef4444' : ratio >= 0.7 ? '#eab308' : color;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis domain={[0, maxValue]} hide />
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
