import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useMenu } from '../contexts/MenuContext'
import type { Diet, PriceRange, MenuFilters } from '../types/menu'
import './FilterPanel.css'

const dietOptions: { value: Diet; key: string }[] = [
  { value: 'all', key: 'all' },
  { value: 'vegetarian', key: 'vegetarian' },
  { value: 'non-vegetarian', key: 'nonVegetarian' },
]

const priceOptions: { value: PriceRange; labelKey: string; priceNum?: number }[] = [
  { value: 'all', labelKey: 'anyPrice' },
  { value: 'under30', labelKey: 'under', priceNum: 30 },
  { value: 'under50', labelKey: 'under', priceNum: 50 },
  { value: 'under100', labelKey: 'under', priceNum: 100 },
  { value: 'over100', labelKey: 'over100' },
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
  if (filters.priceRange !== 'all') {
    const priceOpt = priceOptions.find((o) => o.value === filters.priceRange)
    if (priceOpt) {
      labels.push(
        priceOpt.value === 'over100'
          ? t('filters.over100')
          : t(`filters.${priceOpt.labelKey}`, { price: priceOpt.priceNum })
      )
    }
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
  const {
    filters,
    viewMode,
    setViewMode,
    setDiet,
    setPriceRange,
    setSortBy,
    setChefSpecialOnly,
    clearFilters,
    filteredDishes,
  } = useMenu()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const hasActiveFilters =
    filters.diet !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.sortBy !== 'default' ||
    filters.chefSpecialOnly

  const activeFilterLabels = getFilterLabel(t, filters)

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
          {hasActiveFilters && (
            <div className="filter-panel__active-filters">
              <div className="filter-panel__active-filters-list">
                {activeFilterLabels.map((label, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    className="filter-panel__active-chip"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => {
                      if (label === t('filters.chefSpecial')) {
                        setChefSpecialOnly(false)
                      } else if (label.includes('SAR') || label === t('filters.over100')) {
                        setPriceRange('all')
                      } else if (
                        label === t('filters.sortPopularity') ||
                        label === t('filters.sortPriceAsc') ||
                        label === t('filters.sortPriceDesc')
                      ) {
                        setSortBy('default')
                      } else {
                        setDiet('all')
                      }
                    }}
                  >
                    <span>{label}</span>
                    <span className="filter-panel__active-chip-close">×</span>
                  </motion.button>
                ))}
              </div>
              <button
                type="button"
                className="filter-panel__clear-all"
                onClick={clearFilters}
                aria-label={t('filters.clearAll')}
              >
                {t('filters.clearAll')}
              </button>
            </div>
          )}

          <div className="filter-panel__controls">
            <div className="filter-panel__section">
              <div className="filter-panel__section-label">{t('filters.diet')}</div>
              <div className="filter-panel__segmented" role="group" aria-label={t('filters.diet')}>
                {dietOptions.map(({ value, key }) => (
                  <button
                    key={value}
                    type="button"
                    className={`filter-panel__segment-btn ${filters.diet === value ? 'filter-panel__segment-btn--active' : ''}`}
                    onClick={() => setDiet(value)}
                    aria-pressed={filters.diet === value}
                  >
                    {t(`filters.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-panel__section">
              <div className="filter-panel__section-label">{t('filters.priceRange')}</div>
              <div className="filter-panel__pills">
                {priceOptions.map(({ value, labelKey, priceNum }) => (
                  <button
                    key={value}
                    type="button"
                    className={`filter-panel__pill ${filters.priceRange === value ? 'filter-panel__pill--active' : ''}`}
                    onClick={() => setPriceRange(value)}
                    aria-pressed={filters.priceRange === value}
                  >
                    {value === 'all'
                      ? t(`filters.${labelKey}`)
                      : value === 'over100'
                        ? t('filters.over100')
                        : t(`filters.${labelKey}`, { price: priceNum })}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-panel__section filter-panel__section--compact">
              <div className="filter-panel__section-label">{t('filters.popularity')}</div>
              <select
                className="filter-panel__select"
                value={filters.sortBy}
                onChange={(e) => setSortBy(e.target.value as MenuFilters['sortBy'])}
                aria-label={t('filters.popularity')}
              >
                {sortOptions.map(({ value, key }) => (
                  <option key={value} value={value}>
                    {t(`filters.${key}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-panel__section filter-panel__section--compact">
              <div className="filter-panel__toggle-wrapper">
                <span className="filter-panel__toggle-label">{t('filters.chefSpecial')}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={filters.chefSpecialOnly}
                  className={`filter-panel__ios-toggle ${filters.chefSpecialOnly ? 'filter-panel__ios-toggle--on' : ''}`}
                  onClick={() => setChefSpecialOnly(!filters.chefSpecialOnly)}
                >
                  <span className="filter-panel__ios-toggle-track">
                    <span className="filter-panel__ios-toggle-thumb" />
                  </span>
                </button>
              </div>
            </div>
            <div className="filter-panel__section filter-panel__section--results">
              <div className="filter-panel__results">
                <span className="filter-panel__results-number">{filteredDishes.length}</span>
                <span className="filter-panel__results-label">{t('nav.menu').toLowerCase()}</span>
              </div>
              <div className="filter-panel__view-toggle" role="group" aria-label={t('filters.viewGrid')}>
                <button
                  type="button"
                  className={`filter-panel__view-btn ${viewMode === 'grid' ? 'filter-panel__view-btn--active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  aria-label={t('filters.viewGrid')}
                  title={t('filters.viewGrid')}
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
                  title={t('filters.viewList')}
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
                {hasActiveFilters && (
                  <div className="filter-panel__drawer-active">
                    <div className="filter-panel__drawer-active-list">
                      {activeFilterLabels.map((label, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="filter-panel__drawer-chip"
                          onClick={() => {
                            if (label === t('filters.chefSpecial')) {
                              setChefSpecialOnly(false)
                            } else if (label.includes('SAR') || label === t('filters.over100')) {
                              setPriceRange('all')
                            } else if (
                              label === t('filters.sortPopularity') ||
                              label === t('filters.sortPriceAsc') ||
                              label === t('filters.sortPriceDesc')
                            ) {
                              setSortBy('default')
                            } else {
                              setDiet('all')
                            }
                          }}
                        >
                          {label}
                          <span>×</span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="filter-panel__drawer-clear"
                      onClick={clearFilters}
                    >
                      {t('filters.clearAll')}
                    </button>
                  </div>
                )}

                <div className="filter-panel__drawer-section">
                  <h4 className="filter-panel__drawer-section-title">{t('filters.diet')}</h4>
                  <div className="filter-panel__segmented">
                    {dietOptions.map(({ value, key }) => (
                      <button
                        key={value}
                        type="button"
                        className={`filter-panel__segment-btn ${filters.diet === value ? 'filter-panel__segment-btn--active' : ''}`}
                        onClick={() => setDiet(value)}
                        aria-pressed={filters.diet === value}
                      >
                        {t(`filters.${key}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-panel__drawer-section">
                  <h4 className="filter-panel__drawer-section-title">{t('filters.priceRange')}</h4>
                  <div className="filter-panel__pills filter-panel__pills--wrap">
                    {priceOptions.map(({ value, labelKey, priceNum }) => (
                      <button
                        key={value}
                        type="button"
                        className={`filter-panel__pill ${filters.priceRange === value ? 'filter-panel__pill--active' : ''}`}
                        onClick={() => setPriceRange(value)}
                        aria-pressed={filters.priceRange === value}
                      >
                        {value === 'all'
                          ? t(`filters.${labelKey}`)
                          : value === 'over100'
                            ? t('filters.over100')
                            : t(`filters.${labelKey}`, { price: priceNum })}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-panel__drawer-section">
                  <h4 className="filter-panel__drawer-section-title">{t('filters.popularity')}</h4>
                  <select
                    className="filter-panel__select filter-panel__select--full"
                    value={filters.sortBy}
                    onChange={(e) => setSortBy(e.target.value as MenuFilters['sortBy'])}
                  >
                    {sortOptions.map(({ value, key }) => (
                      <option key={value} value={value}>
                        {t(`filters.${key}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-panel__drawer-section">
                  <div className="filter-panel__toggle-wrapper filter-panel__toggle-wrapper--full">
                    <span className="filter-panel__toggle-label">{t('filters.chefSpecial')}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={filters.chefSpecialOnly}
                      className={`filter-panel__ios-toggle ${filters.chefSpecialOnly ? 'filter-panel__ios-toggle--on' : ''}`}
                      onClick={() => setChefSpecialOnly(!filters.chefSpecialOnly)}
                    >
                      <span className="filter-panel__ios-toggle-track">
                        <span className="filter-panel__ios-toggle-thumb" />
                      </span>
                    </button>
                  </div>
                </div>

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
