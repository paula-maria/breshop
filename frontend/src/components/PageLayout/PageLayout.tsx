import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import FilterSidebar from '../FilterSidebar/FilterSidebar'

interface PageLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  heroSection?: React.ReactNode
}

export default function PageLayout({ children, showSidebar = true, heroSection }: PageLayoutProps) {
  return (
    <div className="home-layout">
      <Header />
      {heroSection && <div className="hero-section-wrapper">{heroSection}</div>}
      <div className="app-main-layout-container">
        {showSidebar && (
          <aside className="app-sidebar-column">
            <FilterSidebar />
          </aside>
        )}
        <main className="home-main app-content-wrapper">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
