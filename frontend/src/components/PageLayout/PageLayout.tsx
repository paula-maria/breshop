import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import FilterSidebar from '../FilterSidebar/FilterSidebar'

interface PageLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  sidebar?: React.ReactNode
  heroSection?: React.ReactNode
}

export default function PageLayout({ children, showSidebar = true, sidebar, heroSection }: PageLayoutProps) {
  return (
    <div className="home-layout">
      <Header />
      {heroSection && <div className="hero-section-wrapper">{heroSection}</div>}
      <div className="app-main-layout-container">
        {(showSidebar || sidebar) && (
          <aside className="app-sidebar-column">
            {sidebar ? sidebar : <FilterSidebar />}
          </aside>
        )}
        <main className="home-main app-content-wrapper">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
