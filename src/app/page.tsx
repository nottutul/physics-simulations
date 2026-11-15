import Link from "next/link";
import {
  Atom,
  ArrowRight,
  Sparkles,
  Search,
  SlidersHorizontal,
  Compass,
  Play,
  Layers,
} from "lucide-react";

interface Simulation {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  href: string;
  status: "active" | "upcoming";
  badge: string;
  iconBg: string;
}

const simulations: Simulation[] = [
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
    iconBg: "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Atom className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                পদার্থবিজ্ঞান সিমুলেশন
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 -mt-0.5">
                Interactive Physics Lab
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50">
              <Sparkles className="w-3.5 h-3.5" />
              ভার্চুয়াল ল্যাব
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-10 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 backdrop-blur-sm">
            <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            ইন্টারেক্টিভ সিমুলেশন প্ল্যাটফর্ম
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            পদার্থবিজ্ঞানের রোমাঞ্চকর{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              সিমুলেশন ল্যাব
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            বিভিন্ন পদার্থবৈজ্ঞানিক সূত্র ও মেকানিজম সরাসরি পরীক্ষা ও পর্যবেক্ষণ করার জন্য আপনার পছন্দের সিমুলেশনটি নির্বাচন করুন।
          </p>
        </div>

        {/* Filter / Search placeholder row */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm max-w-3xl mx-auto">
          <div className="relative w-full sm:w-auto flex-1 flex items-center px-3">
            <Search className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="সিমুলেশন খুঁজুন..."
              className="w-full bg-transparent text-sm focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              readOnly
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800 pt-2 sm:pt-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              সকল বিভাগ
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 w-full flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              উপলব্ধ সিমুলেশনসমূহ
            </h2>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            ১টি সিমুলেশন উপলব্ধ
          </span>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((sim) => (
            <div
              key={sim.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/90 p-6 shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/30 transition-all duration-300 overflow-hidden"
            >
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header of card: Icon / Illustration + Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-800/50 border border-blue-100 dark:border-zinc-700/60 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
                    {/* Stylized Pulley Icon/Illustration */}
                    <svg
                      viewBox="0 0 64 64"
                      className="w-10 h-10 text-blue-600 dark:text-blue-400 stroke-current fill-none"
                    >
                      {/* Ceiling support */}
                      <path
                        d="M20 10 L44 10"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M32 10 L32 20"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
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
                      <path
                        d="M20 28 L20 46"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M44 28 L44 40"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
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
                    {sim.badge}
                  </span>
                </div>

                {/* Category & Titles */}
                <div className="space-y-1 mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {sim.category}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {sim.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    {sim.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                  {sim.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <Link
                  href={sim.href}
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
              সরল দোলক, প্রক্ষেপক গতি, ঘর্ষণ ইত্যাদি বিভিন্ন ধরণের সিমুলেশন পরবর্তীতে এই গ্রিডে যুক্ত করা যাবে।
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>© 2026 পদার্থবিজ্ঞান সিমুলেশন ল্যাব। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
