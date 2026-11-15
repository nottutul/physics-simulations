import { PulleyNav } from "@/components/simulations/pulley/shared/PulleyNav";
import { AtwoodSim } from "@/components/simulations/pulley/atwood/AtwoodSim";

export const metadata = {
  title: "অ্যাটউড মেশিন সিমুলেশন | Atwood Machine Simulation",
  description: "চিরায়ত অ্যাটউড মেশিনে ঝুলন্ত ভরের পতন, ত্বরণ ও সুতার টানের বাস্তবসম্মত পদার্থবিজ্ঞান সিমুলেশন",
};

export default function AtwoodPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <PulleyNav />
        <AtwoodSim />
      </div>
    </div>
  );
}
