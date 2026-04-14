import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

/**
 * InteractionTestZone - Test area for tap accuracy and button interactions
 *
 * Marked with data-interactive to prevent missed tap detection
 * Buttons use var(--button-padding) which adapts via button_enlarge rule
 */
export function InteractionTestZone() {
  const { t } = useTranslation();
  const [clickCounts, setClickCounts] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  const handleClick = (buttonId: number) => {
    setClickCounts((prev) => ({
      ...prev,
      [buttonId]: prev[buttonId] + 1,
    }));
  };

  return (
    <div
      className="border-2 border-accent rounded-lg p-6 bg-accent bg-opacity-5"
      data-interactive
    >
      <h3
        className="font-semibold mb-3 adaptive-transition"
        style={{
          fontSize: 'calc(var(--font-size-base) * 1.25)',
          lineHeight: 'var(--line-height)',
        }}
      >
        {t('interactionZone.heading')}
      </h3>
      <p
        className="mb-6 opacity-75 adaptive-transition"
        style={{
          fontSize: 'var(--font-size-base)',
          lineHeight: 'var(--line-height)',
        }}
      >
        {t('interactionZone.instructions')}
      </p>

      <div className="flex flex-wrap gap-4 mb-6">
        {[1, 2, 3, 4].map((id) => (
          <Button key={id} onClick={() => handleClick(id)}>
            {t('interactionZone.button', { id })}
          </Button>
        ))}
      </div>

      <div
        className="text-sm opacity-60 adaptive-transition"
        style={{
          fontSize: 'calc(var(--font-size-base) * 0.875)',
        }}
      >
        <strong>{t('interactionZone.totalClicks')}</strong>{' '}
        {Object.values(clickCounts).reduce((sum, count) => sum + count, 0)}
        <div className="mt-2 flex gap-4">
          {Object.entries(clickCounts).map(([id, count]) => (
            <span key={id}>
              {t('interactionZone.btnCount', { id, count })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
