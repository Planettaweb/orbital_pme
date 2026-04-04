import { HeroSection } from '@/components/sections/HeroSection'
import { TurbulenceSection } from '@/components/sections/TurbulenceSection'
import { ModulesSection } from '@/components/sections/ModulesSection'
import { ChaosOrbitSection } from '@/components/sections/ChaosOrbitSection'
import { MissionSection } from '@/components/sections/MissionSection'
import { SecuritySection } from '@/components/sections/SecuritySection'
import { DashboardSection } from '@/components/sections/DashboardSection'
import { FooterSection } from '@/components/sections/FooterSection'

const Index = () => {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <TurbulenceSection />
      <ModulesSection />
      <ChaosOrbitSection />
      <MissionSection />
      <SecuritySection />
      <DashboardSection />
      <FooterSection />
    </div>
  )
}

export default Index
