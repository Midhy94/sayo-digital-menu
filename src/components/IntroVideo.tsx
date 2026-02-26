import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import './IntroVideo.css'

const LOGOS = { en: '/assets/Logo_lgt_EN.svg', ar: '/assets/Logo_lgt_AR.svg' } as const

interface IntroVideoProps {
  onContinue: () => void
}

export function IntroVideo({ onContinue }: IntroVideoProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const logoSrc = LOGOS[language === 'ar' ? 'ar' : 'en']

  return (
    <div className="intro-video" role="presentation">
      <video
        className="intro-video__media"
        src="/assets/intro-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div className="intro-video__overlay" aria-hidden />
      <div className="intro-video__content">
        <div className="intro-video__logo-wrap">
          <img
            src={logoSrc}
            alt="SAYO"
            className="intro-video__logo"
            width={200}
            height={96}
          />
        </div>
        <p className="intro-video__story">{t('intro.story')}</p>
        <button
          type="button"
          className="intro-video__continue"
          onClick={onContinue}
        >
          {t('intro.continue')}
        </button>
      </div>
    </div>
  )
}
