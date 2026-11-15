import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Simulation } from "@/types/simulation";

interface SimulationCardProps {
  simulation: Simulation;
}

export function SimulationCard({ simulation }: SimulationCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/90 p-6 shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/30 transition-all duration-300 overflow-hidden">
      {/* Subtle top accent gradient */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header: Icon & Status Badge */}
        <div className="flex items-start justify-between mb-5">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-800/50 border border-blue-100 dark:border-zinc-700/60 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
            {/* Stylized Pulley Icon/Illustration */}
            <svg
              viewBox="0 0 64 64"
              className="w-10 h-10 text-blue-600 dark:text-blue-400 stroke-current fill-none"
            >
              {/* Ceiling support */}
              <path d="M20 10 L44 10" strokeWidth="3" strokeLinecap="round" />
              <path d="M32 10 L32 20" strokeWidth="2.5" strokeLinecap="round" />
              {/* Pulley Wheel */}
              <circle
                cx="32"
                cy="28"
                r="12"
                strokeWidth="2.5"
                className="fill-blue-100/40 dark:fill-blue-900/30"
              />
              <circle cx="32" cy="28" r="3" strokeWidth="2.5" />
              {/* Rope */}
              <path d="M20 28 L20 46" strokeWidth="2" strokeLinecap="round" />
              <path d="M44 28 L44 40" strokeWidth="2" strokeLinecap="round" />
              {/* Load on left side */}
              <rect
                x="14"
                y="46"
                width="12"
                height="10"
                rx="2"
                strokeWidth="2"
                className="fill-blue-500/20"
              />
              {/* Pull arrow on right side */}
              <path
                d="M44 40 L44 48 M41 45 L44 48 L47 45"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            {simulation.badge}
          </span>
        </div>

        {/* Category & Titles */}
        <div className="space-y-1 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {simulation.category}
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {simulation.title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {simulation.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
          {simulation.description}
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
        <Link
          href={simulation.href}
          className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-sm hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-colors duration-200 shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Play className="w-4 h-4 fill-current" />
            সিমুলেশনে প্রবেশ করুন
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
