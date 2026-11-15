import { PulleyNav } from "@/components/simulations/pulley/shared/PulleyNav";
import { DoubleInclineSim } from "@/components/simulations/pulley/double-incline/DoubleInclineSim";

export const metadata = {
  title: "দ্বিমুখী নততল কপিকল সিমুলেশন (৪৫° ও ৬০°) | Double Incline Pulley Simulation",
  description: "দ্বিমুখী নততলে (৪৫° ও ৬০°) যুক্ত কপিকল ও ভরের বাস্তবসম্মত পদার্থবিজ্ঞান সিমুলেশন",
};

export default function DoubleInclinePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <PulleyNav />
        <DoubleInclineSim />
      </div>
    </div>
  );
}
