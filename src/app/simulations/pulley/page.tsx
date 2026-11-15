import { PulleyNav } from "@/components/simulations/pulley/shared/PulleyNav";
import { HorizontalInclineSim } from "@/components/simulations/pulley/horizontal-incline/HorizontalInclineSim";

export const metadata = {
  title: "কপিকল সিমুলেশন | Pulley Simulation",
  description: "টেবিল ও আনত তলে কপিকল ব্যবস্থা ও গতির সিমুলেশন",
};

export default function PulleyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <PulleyNav />
        <HorizontalInclineSim />
      </div>
    </div>
  );
}
