import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { Dish, MenuFilters, Diet, PriceRange } from '../types/menu'
import { menuDishes } from '../data/menuData'

export type ViewMode = 'grid' | 'list'

interface MenuContextValue {
  dishes: Dish[]
  filteredDishes: Dish[]
  filters: MenuFilters
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  setCategory: (category: string) => void
  setDiet: (diet: Diet) => void
  setPriceRange: (range: PriceRange) => void
  setSortBy: (sort: MenuFilters['sortBy']) => void
  clearFilters: () => void
  setChefSpecialOnly: (value: boolean) => void
  openDishModal: (dish: Dish) => void
  closeDishModal: () => void
  modalDish: Dish | null
  setModalDish: (dish: Dish | null) => void
  goToPrevDish: () => void
  goToNextDish: () => void
}

const defaultFilters: MenuFilters = {
  category: 'all',
  diet: 'all',
  priceRange: 'all',
  sortBy: 'default',
  chefSpecialOnly: false,
}

const MenuContext = createContext<MenuContextValue | null>(null)

function filterAndSort(
  dishes: Dish[],
  filters: MenuFilters,
): Dish[] {
  let result = [...dishes]

  if (filters.category !== 'all') {
    if (filters.category === 'starItems') {
      result = result.filter((d) => d.isStar)
    } else if (filters.category === 'chefSpecialties') {
      result = result.filter((d) => d.isChefSpecialty)
    } else {
      result = result.filter((d) => d.categoryKey === filters.category)
    }
  }

  if (filters.chefSpecialOnly) {
    result = result.filter((d) => d.isChefSpecialty)
  }

  if (filters.diet === 'vegetarian') {
    result = result.filter((d) => d.diet === 'vegetarian')
  } else if (filters.diet === 'non-vegetarian') {
    result = result.filter((d) => d.diet === 'non-vegetarian')
  }

  if (filters.priceRange !== 'all') {
    const limits = {
      under30: 30,
      under50: 50,
      under100: 100,
      over100: Infinity,
    }
    const limit = limits[filters.priceRange]
    if (filters.priceRange === 'over100') {
      result = result.filter((d) => d.price >= 100)
    } else {
      result = result.filter((d) => d.price <= limit)
    }
  }

  if (filters.sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (filters.sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price)
  } else if (filters.sortBy === 'popularity') {
    result.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
  } else {
    // default: star & chef first, then by popularity
    result.sort((a, b) => {
      const aScore = (a.isStar ? 2 : 0) + (a.isChefSpecialty ? 1 : 0)
      const bScore = (b.isStar ? 2 : 0) + (b.isChefSpecialty ? 1 : 0)
      if (bScore !== aScore) return bScore - aScore
      return (b.popularity ?? 0) - (a.popularity ?? 0)
    })
  }

  return result
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<MenuFilters>(defaultFilters)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [modalDish, setModalDish] = useState<Dish | null>(null)

  const setCategory = useCallback((category: string) => {
    setFilters((f) => ({ ...f, category }))
  }, [])

  const setDiet = useCallback((diet: Diet) => {
    setFilters((f) => ({ ...f, diet }))
  }, [])

  const setPriceRange = useCallback((range: PriceRange) => {
    setFilters((f) => ({ ...f, priceRange: range }))
  }, [])

  const setSortBy = useCallback((sortBy: MenuFilters['sortBy']) => {
    setFilters((f) => ({ ...f, sortBy }))
  }, [])

  const setChefSpecialOnly = useCallback((chefSpecialOnly: boolean) => {
    setFilters((f) => ({ ...f, chefSpecialOnly }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  const openDishModal = useCallback((dish: Dish) => {
    setModalDish(dish)
  }, [])

  const closeDishModal = useCallback(() => {
    setModalDish(null)
  }, [])

  const filteredDishes = useMemo(() => {
    return filterAndSort(menuDishes, filters)
  }, [filters])

  const goToPrevDish = useCallback(() => {
    if (!modalDish) return
    const idx = filteredDishes.findIndex((d) => d.id === modalDish.id)
    if (idx > 0) setModalDish(filteredDishes[idx - 1])
  }, [modalDish, filteredDishes])

  const goToNextDish = useCallback(() => {
    if (!modalDish) return
    const idx = filteredDishes.findIndex((d) => d.id === modalDish.id)
    if (idx >= 0 && idx < filteredDishes.length - 1) {
      setModalDish(filteredDishes[idx + 1])
    }
  }, [modalDish, filteredDishes])

  const value: MenuContextValue = useMemo(
    () => ({
      dishes: menuDishes,
      filteredDishes,
      filters,
      viewMode,
      setViewMode,
      setCategory,
      setDiet,
      setPriceRange,
      setSortBy,
      clearFilters,
      setChefSpecialOnly,
      openDishModal,
      closeDishModal,
      modalDish,
      setModalDish,
      goToPrevDish,
      goToNextDish,
    }),
    [
      filteredDishes,
      filters,
      viewMode,
      setCategory,
      setDiet,
      setPriceRange,
      setSortBy,
      clearFilters,
      setChefSpecialOnly,
      openDishModal,
      closeDishModal,
      modalDish,
      goToPrevDish,
      goToNextDish,
    ],
  )

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export function useMenu() {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used within MenuProvider')
  return ctx
}
