import { PulleyNav } from "@/components/simulations/pulley/shared/PulleyNav";
import { DoublePulleySim } from "@/components/simulations/pulley/double-hanging/DoublePulleySim";

export const metadata = {
  title: "দ্বৈত কপিকল ও ঝুলন্ত ভর সিমুলেশন | Double Pulley Simulation",
  description: "দুই পাশে দুটি ঝুলন্ত ভর এবং মাঝে অনুভূমিক টেবিলের ওপর একটি ভরের গতিবিদ্যা",
};

export default function DoublePulleyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <PulleyNav />
        <DoublePulleySim />
      </div>
    </div>
  );
}
