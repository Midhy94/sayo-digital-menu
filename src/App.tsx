import { useState, useEffect } from 'react'
import { Hero } from './components/Hero'
import { FilterPanel } from './components/FilterPanel'
import { MenuGrid } from './components/MenuGrid'
import { DishModal } from './components/DishModal'
import { BottomBar } from './components/BottomBar'
import { IntroVideo } from './components/IntroVideo'

function App() {
  const [showIntro, setShowIntro] = useState(true)
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [showIntro])

  if (showIntro) {
    return (
      <IntroVideo onContinue={() => setShowIntro(false)} />
    )
  }

  return (
    <div className="app-shell">
      <a href="#menu-grid" className="skip-link">
        Skip to menu
      </a>
      <div className="app-body">
        <FilterPanel />
        <main className="app-content">
          <Hero />
          <MenuGrid />
        </main>
      </div>
      <BottomBar />
      <DishModal />
    </div>
  )
}

export default App
