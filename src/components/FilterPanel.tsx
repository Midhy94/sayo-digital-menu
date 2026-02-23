import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useMenu } from '../contexts/MenuContext'
import { useTheme } from '../contexts/ThemeContext'
import { ThemeIcon } from './ThemeIcon'
import { ViewIcon } from './ViewIcon'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { Diet, MenuFilters } from '../types/menu'
import './FilterPanel.css'

const navKeys = [
  'all',
  'food',
  'kids',
  'beverages',
] as const

const dietOptions: { value: Diet; key: string }[] = [
  { value: 'all', key: 'all' },
  { value: 'vegetarian', key: 'vegetarian' },
  { value: 'non-vegetarian', key: 'nonVegetarian' },
]

const sortOptions: { value: MenuFilters['sortBy']; key: string }[] = [
  { value: 'default', key: 'sortDefault' },
  { value: 'popularity', key: 'sortPopularity' },
  { value: 'price-asc', key: 'sortPriceAsc' },
  { value: 'price-desc', key: 'sortPriceDesc' },
]

function getFilterLabel(
  t: (key: string, options?: any) => string,
  filters: MenuFilters,
): string[] {
  const labels: string[] = []
  if (filters.diet !== 'all') {
    labels.push(t(`filters.${filters.diet === 'vegetarian' ? 'vegetarian' : 'nonVegetarian'}`))
  }
  if (filters.sortBy !== 'default') {
    const sortOpt = sortOptions.find((o) => o.value === filters.sortBy)
    if (sortOpt) labels.push(t(`filters.${sortOpt.key}`))
  }
  if (filters.chefSpecialOnly) {
    labels.push(t('filters.chefSpecial'))
  }
  return labels
}

export function FilterPanel() {
  const { t } = useTranslation()
  const { toggleTheme, isDark } = useTheme()
  const {
    filters,
    setCategory,
    viewMode,
    setViewMode,
    setDiet,
    setSortBy,
    setChefSpecialOnly,
    clearFilters,
  } = useMenu()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const hasActiveFilters =
    filters.diet !== 'all' ||
    filters.sortBy !== 'default' ||
    filters.chefSpecialOnly

  const activeFilterLabels = getFilterLabel(t, filters)

  // Allow other components (e.g. mobile bottom bar) to open the drawer
  useEffect(() => {
    const handler = () => setDrawerOpen(true)
    document.addEventListener('sayo-open-filters' as any, handler)
    return () => {
      document.removeEventListener('sayo-open-filters' as any, handler)
    }
  }, [])

  return (
    <>
      <motion.aside
        className="filter-panel"
        role="search"
        aria-label={t('filters.title')}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className="filter-panel__inner">
          <nav className="filter-panel__nav" aria-label={t('nav.menu')}>
            <h2 className="filter-panel__sidebar-title">{t('nav.menu')}</h2>
            <ul className="filter-panel__nav-list">
              {navKeys.map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    className={`filter-panel__nav-link ${filters.category === key ? 'filter-panel__nav-link--active' : ''}`}
                    onClick={() => setCategory(key)}
                  >
                    {key === 'all' ? t('nav.showAll') : t(`nav.${key}`)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="filter-panel__filter-block">
            <h2 className="filter-panel__sidebar-title filter-panel__sidebar-title--section">{t('filters.title')}</h2>
            <ul className="filter-panel__option-list" role="group" aria-label={t('filters.title')}>
              <li>
                <button
                  type="button"
                  className={`filter-panel__option-link ${!hasActiveFilters ? 'filter-panel__option-link--active' : ''}`}
                  onClick={clearFilters}
                  aria-pressed={!hasActiveFilters}
                >
                  {t('filters.all')}
                </button>
              </li>
              {dietOptions.filter((o) => o.value !== 'all').map(({ value, key }) => (
                <li key={`diet-${value}`}>
                  <button
                    type="button"
                    className={`filter-panel__option-link ${filters.diet === value ? 'filter-panel__option-link--active' : ''}`}
                    onClick={() => setDiet(value)}
                    aria-pressed={filters.diet === value}
                  >
                    {t(`filters.${key}`)}
                  </button>
                </li>
              ))}
              {sortOptions.filter((o) => o.value !== 'default').map(({ value, key }) => (
                <li key={`sort-${value}`}>
                  <button
                    type="button"
                    className={`filter-panel__option-link ${filters.sortBy === value ? 'filter-panel__option-link--active' : ''}`}
                    onClick={() => setSortBy(value)}
                    aria-pressed={filters.sortBy === value}
                  >
                    {t(`filters.${key}`)}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  role="switch"
                  className={`filter-panel__option-link ${filters.chefSpecialOnly ? 'filter-panel__option-link--active' : ''}`}
                  onClick={() => setChefSpecialOnly(!filters.chefSpecialOnly)}
                  aria-pressed={filters.chefSpecialOnly}
                >
                  {t('filters.chefSpecial')}
                </button>
              </li>
            </ul>
          </div>
          <div className="filter-panel__sidebar-footer">
            <div className="filter-panel__footer-row">
              <div className="filter-panel__theme-wrap">
                <span className="filter-panel__theme-label">{isDark ? t('theme.light') : t('theme.dark')}</span>
                <button
                  type="button"
                  className="filter-panel__theme-btn"
                  onClick={toggleTheme}
                  aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
                  title={isDark ? t('theme.light') : t('theme.dark')}
                >
                  <ThemeIcon isDark={isDark} />
                </button>
              </div>
              <div className="filter-panel__view-wrap">
                <span className="filter-panel__view-label">
                  {viewMode === 'grid' ? t('filters.viewListShort') : t('filters.viewGridShort')}
                </span>
                <button
                  type="button"
                  className="filter-panel__view-btn"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  aria-label={viewMode === 'grid' ? t('filters.viewList') : t('filters.viewGrid')}
                  title={viewMode === 'grid' ? t('filters.viewListShort') : t('filters.viewGridShort')}
                >
                  <ViewIcon viewMode={viewMode} />
                </button>
              </div>
            </div>
            <div className="filter-panel__language-wrap">
              <span className="filter-panel__language-label">{t('language.ariaLabel')}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="filter-panel__drawer-trigger"
          onClick={() => setDrawerOpen(true)}
          aria-expanded={drawerOpen}
          aria-label={t('filters.showFilters')}
        >
          <span className="filter-panel__drawer-icon">⚙</span>
          <span>{t('filters.showFilters')}</span>
          {hasActiveFilters && (
            <span className="filter-panel__drawer-badge" aria-hidden="true">
              {activeFilterLabels.length}
            </span>
          )}
        </button>
      </motion.aside>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="filter-panel__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            <motion.div
              className="filter-panel__drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              role="dialog"
              aria-label={t('filters.title')}
            >
              <div className="filter-panel__drawer-handle" aria-hidden />
              <div className="filter-panel__drawer-header">
                <h3 className="filter-panel__drawer-title">{t('filters.title')}</h3>
                <button
                  type="button"
                  className="filter-panel__drawer-close"
                  onClick={() => setDrawerOpen(false)}
                  aria-label={t('filters.hideFilters')}
                >
                  ×
                </button>
              </div>
              <div className="filter-panel__drawer-body">
                <ul className="filter-panel__drawer-option-list" role="group" aria-label={t('filters.title')}>
                  <li>
                    <button
                      type="button"
                      className={`filter-panel__drawer-option-link ${!hasActiveFilters ? 'filter-panel__drawer-option-link--active' : ''}`}
                      onClick={() => clearFilters()}
                      aria-pressed={!hasActiveFilters}
                    >
                      {t('filters.all')}
                    </button>
                  </li>
                  {dietOptions.filter((o) => o.value !== 'all').map(({ value, key }) => (
                    <li key={`diet-${value}`}>
                      <button
                        type="button"
                        className={`filter-panel__drawer-option-link ${filters.diet === value ? 'filter-panel__drawer-option-link--active' : ''}`}
                        onClick={() => setDiet(value)}
                        aria-pressed={filters.diet === value}
                      >
                        {t(`filters.${key}`)}
                      </button>
                    </li>
                  ))}
                  {sortOptions.filter((o) => o.value !== 'default').map(({ value, key }) => (
                    <li key={`sort-${value}`}>
                      <button
                        type="button"
                        className={`filter-panel__drawer-option-link ${filters.sortBy === value ? 'filter-panel__drawer-option-link--active' : ''}`}
                        onClick={() => setSortBy(value)}
                        aria-pressed={filters.sortBy === value}
                      >
                        {t(`filters.${key}`)}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      role="switch"
                      className={`filter-panel__drawer-option-link ${filters.chefSpecialOnly ? 'filter-panel__drawer-option-link--active' : ''}`}
                      onClick={() => setChefSpecialOnly(!filters.chefSpecialOnly)}
                      aria-pressed={filters.chefSpecialOnly}
                    >
                      {t('filters.chefSpecial')}
                    </button>
                  </li>
                </ul>

                <div className="filter-panel__drawer-section">
                  <h4 className="filter-panel__drawer-section-title">{t('filters.view')}</h4>
                  <div className="filter-panel__view-toggle" role="group" aria-label={t('filters.viewGrid')}>
                    <button
                      type="button"
                      className={`filter-panel__view-btn ${viewMode === 'grid' ? 'filter-panel__view-btn--active' : ''}`}
                      onClick={() => setViewMode('grid')}
                      aria-pressed={viewMode === 'grid'}
                      aria-label={t('filters.viewGrid')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className={`filter-panel__view-btn ${viewMode === 'list' ? 'filter-panel__view-btn--active' : ''}`}
                      onClick={() => setViewMode('list')}
                      aria-pressed={viewMode === 'list'}
                      aria-label={t('filters.viewList')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
