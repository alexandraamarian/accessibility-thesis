import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const handleChange = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('study-language', lng);
    document.documentElement.lang = lng;
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleChange('ro')}
        className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
          i18n.language === 'ro'
            ? 'bg-accent text-bg'
            : 'border border-gray-600 hover:border-accent'
        }`}
        aria-label={t('common.switchLanguage', { language: 'Română' })}
        aria-pressed={i18n.language === 'ro'}
      >
        RO
      </button>
      <button
        onClick={() => handleChange('en')}
        className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
          i18n.language === 'en'
            ? 'bg-accent text-bg'
            : 'border border-gray-600 hover:border-accent'
        }`}
        aria-label={t('common.switchLanguage', { language: 'English' })}
        aria-pressed={i18n.language === 'en'}
      >
        EN
      </button>
    </div>
  );
}
