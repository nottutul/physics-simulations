"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Layers, Sparkles } from "lucide-react";
import { PulleyModelInfo } from "@/types/pulley";

const pulleyModels: PulleyModelInfo[] = [
  {
    id: "horizontal-incline",
    title: "একক কপিকল (টেবিল ও উল্লম্ব)",
    subtitle: "Single Tabletop Pulley (90°)",
    href: "/simulations/pulley",
    status: "active",
  },
  {
    id: "incline-hanging",
    title: "নততল ও ঝুলন্ত ব্লক",
    subtitle: "Incline & Hanging Mass",
    href: "/simulations/pulley/incline-hanging",
    status: "active",
  },
  {
    id: "double-hanging",
    title: "দ্বৈত কপিকল (৩-ভর ব্যবস্থা)",
    subtitle: "Double Pulley with 3 Masses",
    href: "/simulations/pulley/double-hanging",
    status: "active",
  },
  {
    id: "atwood",
    title: "অ্যাটউড মেশিন",
    subtitle: "Atwood Machine",
    href: "#",
    status: "coming_soon",
  },
  {
    id: "block-and-tackle",
    title: "যৌগিক কপিকল",
    subtitle: "Block & Tackle",
    href: "#",
    status: "coming_soon",
  },
];

export function PulleyNav() {
  const pathname = usePathname();

  const isModelActive = (model: PulleyModelInfo) => {
    if (model.id === "horizontal-incline") {
      return (
        pathname === "/simulations/pulley" ||
        pathname === "/simulations/pulley/horizontal-incline"
      );
    }
    return pathname === model.href;
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Top back button and page title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
            title="হোমপেইজে ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              কপিকল সিমুলেশন ল্যাব
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Pulley Mechanics & Dynamics Laboratory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5" />
            বলবিদ্যা ল্যাব
          </span>
        </div>
      </div>

      {/* Pulley Types / Models Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 mr-1 shrink-0">
          <Layers className="w-3.5 h-3.5" />
          <span>মডেলসমূহ:</span>
        </div>

        {pulleyModels.map((model) => {
          const isActive = isModelActive(model);
          const isAvailable = model.status === "active";

          if (isActive) {
            return (
              <span
                key={model.id}
                className="shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {model.title}
              </span>
            );
          }

          if (isAvailable) {
            return (
              <Link
                key={model.id}
                href={model.href}
                className="shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                {model.title}
              </Link>
            );
          }

          return (
            <span
              key={model.id}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 dark:bg-zinc-800/60 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
            >
              {model.title}
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                শীঘ্রই আসছে
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
