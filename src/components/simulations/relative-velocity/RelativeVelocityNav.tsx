"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Compass } from "lucide-react";

export function RelativeVelocityNav() {
  return (
    <nav className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors shadow-sm border border-zinc-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>মূল পাতা (Home)</span>
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-400" />
            <h1 className="text-lg font-bold text-zinc-100">
              আপেক্ষিক বেগ: চলমান বাস, বাতাস ও বৃষ্টি
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            Relative Velocity Simulation: Moving Bus, Wind & Raindrops on Windshield
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800">
          <Sparkles className="w-3 h-3" />
          <span>ইন্টারেক্টিভ ল্যাব</span>
        </span>
      </div>
    </nav>
  );
}
