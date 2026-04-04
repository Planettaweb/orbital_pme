import { useEffect, useState } from 'react'

export function BackgroundElements() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY)
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Starfield */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-30"
        style={{
          backgroundImage: `radial-gradient(2px 2px at 20px 30px, #fff, rgba(0,0,0,0)),
                           radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
                           radial-gradient(2px 2px at 50px 160px, #fff, rgba(0,0,0,0)),
                           radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
                           radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
                           radial-gradient(2px 2px at 160px 120px, #fff, rgba(0,0,0,0))`,
        }}
      />

      {/* Planet Horizon */}
      <div
        className="absolute rounded-full"
        style={{
          width: '120vw',
          height: '120vw',
          bottom: '-90vh',
          right: '-20vw',
          background:
            'radial-gradient(circle at 50% 0%, #000 0%, #1a1a2e 40%, #D66D50 65%, #FFD28E 70%, transparent 72%)',
          transform: `translateY(${scrollY * 0.1}px) scale(${1 + scrollY * 0.0005})`,
          willChange: 'transform',
          opacity: 0.9,
          zIndex: 0,
        }}
      />

      {/* Orbital Rings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <div className="border border-white rounded-full w-[60vw] h-[60vw]" />
        <div className="border border-white border-dashed rounded-full w-[80vw] h-[80vw]" />
        <div className="border border-white rounded-full w-[110vw] h-[110vw]" />
      </div>
    </div>
  )
}
