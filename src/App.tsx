import { Header } from './components/Header'
import { FilterPanel } from './components/FilterPanel'
import { StarItemsSection } from './components/StarItemsSection'
import { MenuGrid } from './components/MenuGrid'
import { DishModal } from './components/DishModal'
import { BottomBar } from './components/BottomBar'
import { useMenu } from './contexts/MenuContext'
import { useScrollDirection } from './hooks/useScrollDirection'

function App() {
  const { filters } = useMenu()
  const scrollDir = useScrollDirection()

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.diet !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.sortBy !== 'default' ||
    filters.chefSpecialOnly

  return (
    <div className={`app-shell app-shell--scroll-${scrollDir}`}>
      <a href="#menu-grid" className="skip-link">
        Skip to menu
      </a>
      <Header />
      <main>
        <FilterPanel />
        {!hasActiveFilters && <StarItemsSection />}
        <MenuGrid />
      </main>
      <BottomBar />
      <DishModal />
    </div>
  )
}

export default App
