import { Header } from './components/Header'
import { FilterPanel } from './components/FilterPanel'
import { StarItemsSection } from './components/StarItemsSection'
import { MenuGrid } from './components/MenuGrid'
import { DishModal } from './components/DishModal'
import { useMenu } from './contexts/MenuContext'

function App() {
  const { filters } = useMenu()

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.diet !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.sortBy !== 'default' ||
    filters.chefSpecialOnly

  return (
    <>
      <a href="#menu-grid" className="skip-link">
        Skip to menu
      </a>
      <Header />
      <main>
        <FilterPanel />
        {!hasActiveFilters && <StarItemsSection />}
        <MenuGrid />
      </main>
      <DishModal />
    </>
  )
}

export default App
