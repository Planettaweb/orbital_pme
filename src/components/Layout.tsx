import { Outlet } from 'react-router-dom'
import { BackgroundElements } from '@/components/BackgroundElements'
import { Navbar } from '@/components/Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-void text-starlight selection:bg-horizon-gold/30 selection:text-horizon-gold font-sans overflow-x-hidden">
      <BackgroundElements />
      <Navbar />
      <main className="relative z-10 pt-20">
        <Outlet />
      </main>
    </div>
  )
}
