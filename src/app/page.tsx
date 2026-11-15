import { Navbar } from "@/components/home/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { SimulationGrid } from "@/components/home/SimulationGrid";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar />
      <HeroSection />
      <SimulationGrid />
      <Footer />
    </div>
  );
}
