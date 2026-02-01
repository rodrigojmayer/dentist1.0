import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Team } from "@/components/team"
import { About } from "@/components/about"
import { Locations } from "@/components/locations"
import { Services } from "@/components/services"
import { WhyUs } from "@/components/why-us"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Team />
      <About />
      <Locations />
      <Services />
      <WhyUs />
      <Footer />
    </main>
  )
}
