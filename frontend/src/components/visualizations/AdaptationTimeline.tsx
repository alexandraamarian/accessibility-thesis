interface AdaptationEvent {
  ruleId: string;
  timestamp: number;
}

interface AdaptationTimelineProps {
  events: AdaptationEvent[];
  sessionStart: number;
}

const RULE_COLORS: Record<string, string> = {
  font_scale: '#38bdf8',
  button_enlarge: '#a78bfa',
  contrast_boost: '#f59e0b',
  spacing_increase: '#10b981',
  motion_reduce: '#ef4444',
  cursor_enlarge: '#ec4899',
  layout_simplify: '#8b5cf6',
  reading_aid: '#06b6d4',
};

export function AdaptationTimeline({ events, sessionStart }: AdaptationTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-xs opacity-50 text-center py-2">
        No adaptations triggered yet
      </div>
    );
  }

  const now = Date.now();
  const totalDuration = now - sessionStart;

  return (
    <div>
      <div className="relative h-6 bg-gray-800 rounded overflow-hidden">
        {events.map((event, index) => {
          const position = ((event.timestamp - sessionStart) / totalDuration) * 100;
          return (
            <div
              key={index}
              className="absolute top-0 bottom-0 w-1 rounded"
              style={{
                left: `${Math.min(position, 99)}%`,
                backgroundColor: RULE_COLORS[event.ruleId] || '#6b7280',
              }}
              title={`${event.ruleId} at ${new Date(event.timestamp).toLocaleTimeString()}`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        {Object.entries(RULE_COLORS).map(([ruleId, color]) => {
          const count = events.filter((e) => e.ruleId === ruleId).length;
          if (count === 0) return null;
          return (
            <span key={ruleId} className="text-xs flex items-center gap-1">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {ruleId.replace('_', ' ')} ({count})
            </span>
          );
        })}
      </div>
    </div>
  );
}
