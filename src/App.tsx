import { Hero } from './components/Hero'
import { FilterPanel } from './components/FilterPanel'
import { StarItemsSection } from './components/StarItemsSection'
import { MenuGrid } from './components/MenuGrid'
import { DishModal } from './components/DishModal'
import { BottomBar } from './components/BottomBar'
import { useMenu } from './contexts/MenuContext'

function App() {
  const { filters } = useMenu()

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.diet !== 'all' ||
    filters.sortBy !== 'default' ||
    filters.chefSpecialOnly

  return (
    <div className="app-shell">
      <a href="#menu-grid" className="skip-link">
        Skip to menu
      </a>
      <div className="app-body">
        <FilterPanel />
        <main className="app-content">
          <Hero />
          {!hasActiveFilters && <StarItemsSection />}
          <MenuGrid />
        </main>
      </div>
      <BottomBar />
      <DishModal />
    </div>
  )
}

export default App
