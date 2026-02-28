import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  availableSubcategories: { key: string; titleKey: string }[]
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  setCategory: (category: string) => void
  setSubcategory: (subcategory: string) => void
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
  subcategory: 'all',
  diet: 'all',
  priceRange: 'all',
  sortBy: 'default',
  chefSpecialOnly: false,
}

const MenuContext = createContext<MenuContextValue | null>(null)
const VIEW_MODE_KEY = 'sayo-view-mode'

const categoryOrder = [
  'appetizers', 'soups', 'salads', 'sushi', 'dimSum', 'robata', 'mains', 'indian', 'desserts', 'drinks', 'combos',
] as const

function getDishesForMenu(dishes: Dish[], menuCategory: string): Dish[] {
  if (menuCategory === 'all') return dishes
  if (menuCategory === 'food') return dishes.filter((d) => d.categoryKey !== 'drinks')
  if (menuCategory === 'beverages') return dishes.filter((d) => d.categoryKey === 'drinks')
  if (menuCategory === 'kids') return dishes.filter((d) => d.menuGroup === 'kids')
  return dishes
}

function getAvailableSubcategories(dishes: Dish[], menuCategory: string): { key: string; titleKey: string }[] {
  const menuDishes = getDishesForMenu(dishes, menuCategory)
  const keys = new Set<string>()
  for (const d of menuDishes) {
    keys.add(d.categoryKey)
  }
  const ordered = categoryOrder.filter((k) => keys.has(k))
  const extra = [...keys].filter((k) => !categoryOrder.includes(k as any))
  return [...ordered, ...extra].map((key) => ({ key, titleKey: `categories.${key}` }))
}

function filterAndSort(
  dishes: Dish[],
  filters: MenuFilters,
): Dish[] {
  let result = getDishesForMenu(dishes, filters.category)

  if (filters.subcategory !== 'all') {
    result = result.filter((d) => d.categoryKey === filters.subcategory)
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

function getInitialViewMode(): ViewMode {
  if (typeof window === 'undefined') return 'grid'
  try {
    const stored = localStorage.getItem(VIEW_MODE_KEY)
    if (stored === 'list' || stored === 'grid') return stored
  } catch {
    /* ignore */
  }
  return window.matchMedia('(max-width: 900px)').matches ? 'list' : 'grid'
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<MenuFilters>(defaultFilters)
  const [viewMode, setViewModeState] = useState<ViewMode>(getInitialViewMode)
  const [modalDish, setModalDish] = useState<Dish | null>(null)

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode)
    try {
      localStorage.setItem(VIEW_MODE_KEY, mode)
    } catch {
      /* ignore */
    }
  }, [])

  // Correct default on mobile when no stored preference – viewport can be wrong on initial load
  useEffect(() => {
    const applyMobileDefault = () => {
      try {
        if (localStorage.getItem(VIEW_MODE_KEY)) return
      } catch {
        return
      }
      if (window.matchMedia('(max-width: 900px)').matches) {
        setViewModeState('list')
      }
    }
    applyMobileDefault()
    const t = setTimeout(applyMobileDefault, 250)
    return () => clearTimeout(t)
  }, [])

  const setCategory = useCallback((category: string) => {
    setFilters((f) => ({ ...f, category, subcategory: 'all' }))
  }, [])

  const setSubcategory = useCallback((subcategory: string) => {
    setFilters((f) => ({ ...f, subcategory }))
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

  const availableSubcategories = useMemo(() => {
    return getAvailableSubcategories(menuDishes, filters.category)
  }, [filters.category])

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
      availableSubcategories,
      viewMode,
      setViewMode,
      setCategory,
      setSubcategory,
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
      availableSubcategories,
      viewMode,
      setCategory,
      setSubcategory,
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
