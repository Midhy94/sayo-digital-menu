import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=85'

export function Hero() {
  const { t } = useTranslation()

  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
    >
      <div className="hero__bg" aria-hidden="true">
        <img
          src={HERO_IMAGE}
          alt=""
          className="hero__bg-image"
          fetchPriority="high"
        />
        <div className="hero__bg-overlay" />
      </div>
      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="hero__tagline">{t('hero.tagline')}</p>
        <h1 id="hero-title" className="hero__title">
          {t('hero.title')}
        </h1>
        <p className="hero__subtitle">{t('hero.subtitle')}</p>
        <p className="hero__description">{t('hero.description')}</p>
        <motion.a
          href="#menu-grid"
          className="hero__cta"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('hero.cta')}
        </motion.a>
      </motion.div>
      <motion.a
        href="#star-items"
        className="hero__scroll-hint"
        aria-label="Scroll to menu"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <span className="hero__scroll-dot" />
      </motion.a>
    </section>
  )
}
