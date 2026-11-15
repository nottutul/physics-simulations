import { PulleyNav } from "@/components/simulations/pulley/shared/PulleyNav";
import { InclineHangingSim } from "@/components/simulations/pulley/incline-hanging/InclineHangingSim";

export const metadata = {
  title: "নততল ও ঝুলন্ত ভর কপিকল সিমুলেশন | Incline & Hanging Pulley Simulation",
  description: "নততলের শীর্ষে কপিকল ও ঝুলন্ত ভরের বাস্তবসম্মত পদার্থবিজ্ঞান সিমুলেশন",
};

export default function InclineHangingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <PulleyNav />
        <InclineHangingSim />
      </div>
    </div>
  );
}
