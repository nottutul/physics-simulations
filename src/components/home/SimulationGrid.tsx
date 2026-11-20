import { Layers, Atom } from "lucide-react";
import { Simulation } from "@/types/simulation";
import { SimulationCard } from "./SimulationCard";

const simulations: Simulation[] = [
  {
    id: "relative-velocity",
    title: "আপেক্ষিক বেগ (বাস ও বৃষ্টি)",
    subtitle: "Relative Velocity: Bus, Wind & Rain",
    category: "গতিবিদ্যা (Kinematics)",
    description:
      "চলমান বাস, বাতাস ও বৃষ্টির আপেক্ষিক গতিবেগ, ভেক্টর ডায়াগ্রাম এবং কোন পাশের কাচ ভিজবে তার বাস্তবসম্মত সিমুলেশন।",
    href: "/simulations/relative-velocity",
    status: "active",
    badge: "নতুন",
  },
  {
    id: "pulley",
    title: "কপিকল",
    subtitle: "Pulley System Simulation",
    category: "বলবিদ্যা (Mechanics)",
    description:
      "ভার উত্তোলন, যান্ত্রিক সুবিধা, একক ও একাধিক কপিকল ব্যবস্থা এবং বলের গতিশীলতার বাস্তবসম্মত সিমুলেশন।",
    href: "/simulations/pulley",
    status: "active",
    badge: "প্রস্তুত",
  },
];

export function SimulationGrid() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 w-full flex-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            উপলব্ধ সিমুলেশনসমূহ
          </h2>
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {simulations.length}টি সিমুলেশন উপলব্ধ
        </span>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulations.map((sim) => (
          <SimulationCard key={sim.id} simulation={sim} />
        ))}

        {/* Placeholder card indicating more simulations can be added */}
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-400 dark:text-zinc-500 min-h-[280px]">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
            <Atom className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h4 className="text-base font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            পরবর্তী সিমুলেশন যুক্ত হবে
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 max-w-xs">
            সরল দোলক, প্রক্ষেপক গতি, ঘর্ষণ ইত্যাদি বিভিন্ন ধরণের সিমুলেশন পরবর্তীতে এই গ্রিডে যুক্ত করা হবে।
          </p>
        </div>
      </div>
    </main>
  );
}
