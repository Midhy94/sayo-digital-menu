import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { ThemeIcon } from './ThemeIcon'
import { LanguageSheet } from './LanguageSheet'
import './BottomBar.css'

export function BottomBar() {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const { language } = useLanguage()
  const [languageSheetOpen, setLanguageSheetOpen] = useState(false)

  const openFilters = () => {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('sayo-open-filters'))
    }
  }

  return (
    <>
      <nav className="bottom-bar" aria-label="Quick actions">
        <button
          type="button"
          className="bottom-bar__item"
          onClick={() => setLanguageSheetOpen(true)}
          aria-label={t('language.ariaLabel')}
        >
          <span className="bottom-bar__icon" aria-hidden="true">
            {language === 'en' ? '🇺🇸' : '🇸🇦'}
          </span>
          <span className="bottom-bar__label">
            {language === 'en' ? t('language.en') : t('language.ar')}
          </span>
        </button>

        <button
          type="button"
          className="bottom-bar__item"
          onClick={toggleTheme}
          aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
        >
          <span className="bottom-bar__icon bottom-bar__icon-svg" aria-hidden="true">
            <ThemeIcon isDark={isDark} />
          </span>
          <span className="bottom-bar__label">
            {isDark ? t('theme.light') : t('theme.dark')}
          </span>
        </button>

        <button
          type="button"
          className="bottom-bar__item bottom-bar__item--primary"
          onClick={openFilters}
        >
          <span className="bottom-bar__icon" aria-hidden="true">
            ⚙
          </span>
          <span className="bottom-bar__label">{t('filters.title')}</span>
        </button>
      </nav>

      <LanguageSheet
        open={languageSheetOpen}
        onClose={() => setLanguageSheetOpen(false)}
      />
    </>
  )
}

