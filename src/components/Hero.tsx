import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import './Hero.css'

const LOGOS = {
  dark: { en: '/assets/Logo_lgt_EN.svg', ar: '/assets/Logo_lgt_AR.svg' },
  light: { en: '/assets/Logo_EN.svg', ar: '/assets/Logo_AR.svg' },
} as const

export function Hero() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { language } = useLanguage()
  const themeKey = isDark ? 'dark' : 'light'
  const langKey = language === 'ar' ? 'ar' : 'en'
  const logoSrc = LOGOS[themeKey][langKey]

  return (
    <section className="hero" aria-label={t('hero.title')}>
      <div className="hero__inner">
        <div className="hero__logo-wrap">
          <img
            src={logoSrc}
            alt="SAYO"
            className="hero__logo"
            width={180}
            height={86}
          />
        </div>
        <p className="hero__intro">{t('hero.description')}</p>
        {t('hero.tagline') && (
          <p className="hero__tagline">{t('hero.tagline')}</p>
        )}
      </div>
    </section>
  )
}
