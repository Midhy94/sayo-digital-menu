import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useMenu } from '../contexts/MenuContext'
import { DishCard } from './DishCard'
import { categoryOrder } from '../data/menuData'
import type { Dish } from '../types/menu'
import './MenuGrid.css'

function groupByCategory(dishes: Dish[]): Map<string, Dish[]> {
  const map = new Map<string, Dish[]>()
  for (const dish of dishes) {
    const key = dish.categoryKey
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(dish)
  }
  return map
}

const gridSectionKeys = categoryOrder.filter(
  (k) => k !== 'starItems' && k !== 'chefSpecialties'
)

export function MenuGrid() {
  const { t } = useTranslation()
  const { filteredDishes, viewMode } = useMenu()
  const byCategory = useMemo(() => groupByCategory(filteredDishes), [filteredDishes])

  const sections = gridSectionKeys
    .map((key) => ({ key, dishes: byCategory.get(key) ?? [] }))
    .filter((s) => s.dishes.length > 0)

  if (filteredDishes.length === 0) {
    return (
      <section id="menu-grid" className="menu-grid" aria-label="Menu items">
        <div className="menu-grid__inner">
          <p className="menu-grid__empty">
            No dishes match your filters. Try clearing some filters.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="menu-grid"
      className={`menu-grid ${viewMode === 'list' ? 'menu-grid--list' : ''}`}
      aria-label="Menu items"
    >
      <div className="menu-grid__inner">
        {sections.map(({ key, dishes }, sectionIndex) => (
          <motion.div
            key={key}
            className="menu-grid__section"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`menu-grid__section-hero menu-grid__section-hero--${key}`} data-category={key}>
              <h2 className="menu-grid__section-title">{t(`categories.${key}`)}</h2>
            </div>
            <div className="menu-grid__list">
              {dishes.map((dish, index) => (
                <DishCard key={dish.id} dish={dish} index={sectionIndex * 20 + index} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
